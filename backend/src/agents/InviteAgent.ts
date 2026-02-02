import { BaseAgent } from './BaseAgent.js';
import { InvitationEmail, InviteCandidateRequest } from '../types/index.js';

/**
 * Agent for generating interview invitation emails
 * Creates personalized, professional invitation emails based on resume and JD
 */
export class InviteAgent extends BaseAgent<InviteCandidateRequest, InvitationEmail> {
  constructor() {
    super('InviteAgent');
  }

  protected getAgentPrompt(): string {
    return `You are a professional HR recruiter crafting interview invitation emails. Your task is to create a personalized, warm, and professional invitation email for a candidate.

The email should:
1. Address the candidate by name (extract from resume)
2. Mention the specific position they're being considered for
3. Highlight why they were selected (based on their qualifications matching the JD)
4. Be professional yet warm and welcoming
5. Include a clear call to action

Provide your response in the following JSON format (and ONLY this JSON format, no additional text):

\`\`\`json
{
  "subject": "<email subject line>",
  "body": "<full email body with proper formatting, use \\n for line breaks>"
}
\`\`\`

Make the email feel personalized and genuine, not like a template. Reference specific skills or experiences from the candidate's resume that make them a good fit.`;
  }

  protected formatInput(input: InviteCandidateRequest): string {
    return `## Candidate's Resume:
${input.resume}

## Job Description:
${input.jd}

Please generate a professional interview invitation email for this candidate.`;
  }

  protected parseOutput(response: string): InvitationEmail {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/(\{[\s\S]*\})/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as InvitationEmail;
      } catch {
        // Continue to try parsing the entire response
      }
    }
    
    try {
      return JSON.parse(response) as InvitationEmail;
    } catch {
      // Return a default structure if parsing fails
      return {
        subject: 'Interview Invitation',
        body: response,
      };
    }
  }

  /**
   * Generate an interview invitation email
   */
  async generateInvitation(resume: string, jd: string, requestId?: string): Promise<InvitationEmail> {
    return this.executeWithJsonResponse({ resume, jd }, jd, requestId);
  }
}

export const inviteAgent = new InviteAgent();
