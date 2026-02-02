import { BaseAgent } from './BaseAgent.js';
import { InterviewEvaluation, EvaluateInterviewRequest } from '../types/index.js';

/**
 * Agent for evaluating interview transcripts
 * Analyzes candidate performance based on resume, JD, and interview content
 */
export class EvaluationAgent extends BaseAgent<EvaluateInterviewRequest, InterviewEvaluation> {
  constructor() {
    super('EvaluationAgent');
  }

  protected getAgentPrompt(): string {
    return `You are an expert interview evaluator and HR analyst. Your task is to evaluate a candidate's interview performance based on the interview transcript, their resume, and the job description.

    You are very strict and objective in your evaluation. You are kean on the deep and true understanding of the knowledge and skills required for the job.

Analyze the following aspects:
1. **Answer Analysis**: You will analyze every question and answer from the interview transcript, give each answer a true score and then add them up to get the overall score.
2. **Technical Competency**: How well did the candidate demonstrate technical knowledge?
3. **Communication Skills**: How effectively did the candidate communicate?
4. **Culture Fit**: Does the candidate seem like a good fit for the role and company?
5. **Strengths**: What are the candidate's key strengths based on the interview?
6. **Areas for Improvement**: What weaknesses or concerns were identified?
7. **Key Insights**: Notable observations from the interview
8. **Hiring Recommendation**: Should the candidate proceed to the next round?

Provide your evaluation in the following JSON format (and ONLY this JSON format, no additional text):

\`\`\`json
{
  "overallScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "cultureFitScore": <number 0-100>,
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "keyInsights": ["insight1", "insight2", ...],
  "hiringRecommendation": "<'Strong Hire', 'Hire', 'Maybe', 'No Hire', or 'Strong No Hire'>",
  "suggestedFollowUp": ["follow-up question or topic 1", "follow-up question or topic 2", ...]
}
\`\`\`

Be objective, fair, and thorough in your evaluation. Consider both what was said and how it was said. Look for evidence of relevant skills, experience, and potential.`;
  }

  protected formatInput(input: EvaluateInterviewRequest): string {
    return `## Candidate's Resume:
${input.resume}

## Job Description:
${input.jd}

## Interview Transcript:
${input.interviewScript}

Please evaluate this candidate's interview performance.`;
  }

  protected parseOutput(response: string): InterviewEvaluation {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/(\{[\s\S]*\})/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as InterviewEvaluation;
      } catch {
        // Continue to try parsing the entire response
      }
    }
    
    try {
      return JSON.parse(response) as InterviewEvaluation;
    } catch {
      // Return a default structure if parsing fails
      return {
        overallScore: 0,
        technicalScore: 0,
        communicationScore: 0,
        cultureFitScore: 0,
        strengths: [],
        weaknesses: [],
        keyInsights: ['Unable to parse evaluation'],
        hiringRecommendation: 'Unable to evaluate',
        suggestedFollowUp: [],
      };
    }
  }

  /**
   * Evaluate an interview
   */
  async evaluate(resume: string, jd: string, interviewScript: string, requestId?: string): Promise<InterviewEvaluation> {
    return this.executeWithJsonResponse({ resume, jd, interviewScript }, jd, requestId);
  }
}

export const evaluationAgent = new EvaluationAgent();
