import { Message } from '../types/index.js';
import { llmService } from '../services/llm/LLMService.js';
import { languageService } from '../services/LanguageService.js';
import { logger } from '../services/LoggerService.js';

export interface RecruitmentChatContext {
  role?: string;
  seniority?: string;
  industry?: string;
  location?: string;
  employmentType?: string;
  teamContext?: string;
  companyStage?: string;
  compensation?: string;
  mustHaves?: string[];
  niceToHaves?: string[];
  jobDescription?: string;
}

export interface RecruitmentChatInput {
  history: Message[];
  message: string;
  context?: RecruitmentChatContext;
  requestId?: string;
}

export interface RecruitmentChatResult {
  reply: string;
  action?: 'create_request';
}

const ACTION_MARKER = '[[ACTION:CREATE_REQUEST]]';

export class RecruitmentConsultantAgent {
  private buildSystemPrompt(languageInstruction?: string): string {
    const corePrompt = `You are RoboHire's Recruitment Consultant Agent — a senior recruiter with 15+ years across tech, product, sales, operations, and leadership roles.

Your job is to help the user define a clear, complete hiring brief. You must be confident, practical, and concise.

Behavior guidelines:
- When a role is mentioned, infer a baseline set of responsibilities, must-have skills, and expected experience using your domain knowledge.
- Recommend improvements and industry-standard requirements tailored to the role.
- Ask targeted clarifying questions to fill gaps: seniority, scope, team context, tech stack, domain knowledge, location/remote, compensation, timeline, interview process.
- Keep the user aligned by providing a \"Summary so far\" section with bullet points.
- Separate requirements into: Must-haves, Nice-to-haves, Responsibilities, Tools/Stack, Soft skills, Success metrics.
- If a job description is provided, extract key requirements and highlight missing or ambiguous items.

Response format (keep concise):
1) Recommendations (short bullets)
2) Clarifying questions (2–5 questions)
3) Summary so far (bulleted, only what is confirmed)

If the user explicitly confirms they want to proceed (e.g., \"yes\", \"looks good\", \"create the request\"), append this exact line at the end:
${ACTION_MARKER}

Do not explain the marker. Keep it on its own line.`;

    if (languageInstruction) {
      return `${languageInstruction}\n\n${corePrompt}`;
    }

    return corePrompt;
  }

  private buildUserMessage(message: string, context?: RecruitmentChatContext): string {
    const contextBlocks: string[] = [];

    if (context?.role) contextBlocks.push(`Role: ${context.role}`);
    if (context?.seniority) contextBlocks.push(`Seniority: ${context.seniority}`);
    if (context?.industry) contextBlocks.push(`Industry: ${context.industry}`);
    if (context?.location) contextBlocks.push(`Location: ${context.location}`);
    if (context?.employmentType) contextBlocks.push(`Employment type: ${context.employmentType}`);
    if (context?.teamContext) contextBlocks.push(`Team context: ${context.teamContext}`);
    if (context?.companyStage) contextBlocks.push(`Company stage: ${context.companyStage}`);
    if (context?.compensation) contextBlocks.push(`Compensation: ${context.compensation}`);
    if (context?.mustHaves?.length) contextBlocks.push(`Must-haves: ${context.mustHaves.join(', ')}`);
    if (context?.niceToHaves?.length) contextBlocks.push(`Nice-to-haves: ${context.niceToHaves.join(', ')}`);

    if (context?.jobDescription) {
      contextBlocks.push(`Job Description:\n${context.jobDescription}`);
    }

    if (contextBlocks.length === 0) {
      return message;
    }

    return `Context:\n${contextBlocks.join('\n')}\n\nUser message:\n${message}`;
  }

  private extractAction(response: string): { reply: string; action?: 'create_request' } {
    const actionDetected = response.includes(ACTION_MARKER);
    const cleaned = response.replace(ACTION_MARKER, '').trim();

    return {
      reply: cleaned,
      action: actionDetected ? 'create_request' : undefined,
    };
  }

  async chat(input: RecruitmentChatInput): Promise<RecruitmentChatResult> {
    const languageSource = input.context?.jobDescription || input.message;
    const detectedLanguage = languageService.detectLanguage(languageSource);
    const languageInstruction = languageService.getLanguageInstruction(languageSource);

    if (input.requestId) {
      logger.logLanguageDetection(input.requestId, detectedLanguage, 'auto');
    }

    const systemPrompt = this.buildSystemPrompt(languageInstruction);
    const userMessage = this.buildUserMessage(input.message, input.context);

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...input.history,
      { role: 'user', content: userMessage },
    ];

    const response = await llmService.chat(messages, {
      temperature: 0.6,
      requestId: input.requestId,
    });

    return this.extractAction(response);
  }
}

export const recruitmentConsultantAgent = new RecruitmentConsultantAgent();
