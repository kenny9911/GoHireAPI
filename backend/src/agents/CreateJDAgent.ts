import { llmService } from '../services/llm/LLMService.js';
import { languageService } from '../services/LanguageService.js';

export interface CreateJDInput {
  title?: string;
  requirements?: string;
  jobDescription?: string;
  language?: string;
  requestId?: string;
}

export class CreateJDAgent {
  async generate(input: CreateJDInput): Promise<string> {
    const title = input.title?.trim() || '';
    const requirements = input.requirements?.trim() || '';
    const existingJD = input.jobDescription?.trim() || '';
    const preferredLocale = input.language?.trim() || '';

    const languageSource = existingJD || requirements || title;
    const preferredLanguage = preferredLocale
      ? languageService.getLanguageFromLocale(preferredLocale)
      : null;
    const languageInstruction = preferredLanguage
      ? languageService.getLanguageInstructionForLanguage(preferredLanguage)
      : languageService.getLanguageInstruction(languageSource || '');

    const languageNote = preferredLanguage ? `User selected language: ${preferredLanguage}.` : '';

    const systemPrompt = `${languageInstruction}

${languageNote}

You are a senior recruitment consultant and job description strategist.
Create a clear, concise, and market-ready job description in the response language that is optimized for SEO, job boards, and ATS screening.

Guidelines:
- Output in Markdown only. Do not wrap the response in code fences.
- Use a top-level heading for the job title, then section headings for: Overview, Responsibilities, Requirements, Nice-to-haves, Benefits.
- Headings must be in the response language.
- Keep wording professional, specific, and scannable.
- Optimize for job boards and ATS: naturally include key skills, tools, and role keywords from the inputs while avoiding keyword stuffing.
- Use industry-standard role naming and seniority when supported by the inputs.
- Use bullet lists for Responsibilities and Requirements.
- If an existing JD is provided, refine it for clarity, structure, and SEO/ATS alignment while honoring the new requirements.
- If information is missing, use a short "TBD" line for that section.
- Do not invent company-specific details, benefits, or compensation.`;

    const promptParts: string[] = [];
    if (title) {
      promptParts.push(`Title: ${title}`);
    }
    if (requirements) {
      promptParts.push(`Requirements and context:\n${requirements.slice(0, 4000)}`);
    }
    if (existingJD) {
      promptParts.push(`Existing JD (revise and improve):\n${existingJD.slice(0, 6000)}`);
    }

    const userPrompt = promptParts.join('\n\n');

    const response = await llmService.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.4, requestId: input.requestId }
    );

    return response.trim();
  }
}

export const createJDAgent = new CreateJDAgent();
