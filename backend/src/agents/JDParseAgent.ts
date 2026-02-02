import { BaseAgent } from './BaseAgent.js';
import { ParsedJD } from '../types/index.js';

interface JDParseInput {
  jdText: string;
}

/**
 * Agent for parsing job descriptions and extracting structured data
 * Extracts title, requirements, responsibilities, qualifications, etc.
 */
export class JDParseAgent extends BaseAgent<JDParseInput, ParsedJD> {
  constructor() {
    super('JDParseAgent');
  }

  protected getAgentPrompt(): string {
    return `You are an expert job description parser. Your task is to extract ALL information from job description text into a structured format.

## CRITICAL INSTRUCTION - DO NOT LOSE ANY CONTENT:
- You MUST extract EVERY piece of information from the job description
- Do NOT summarize or truncate any text
- Include the COMPLETE text of each requirement, responsibility, qualification, etc.
- Every bullet point, every sentence, every detail must be preserved
- Copy the EXACT text from the JD - do not paraphrase or shorten
- If there are 20 requirements listed, include ALL 20 in the output

Extract ALL of the following:
1. **Job Title**: The exact position title
2. **Company Information**: Company name, about the company, team description
3. **Location**: Work location details (city, remote options, etc.)
4. **Job Overview**: Complete job summary/overview section
5. **Requirements/Must-Have**: ALL required skills, experience, qualifications - COMPLETE text
6. **Nice-to-Have/Preferred**: ALL preferred qualifications - COMPLETE text
7. **Responsibilities**: ALL job duties and responsibilities - COMPLETE text for each
8. **Qualifications**: ALL education, certification requirements - COMPLETE text
9. **Benefits/Perks**: ALL benefits mentioned
10. **Salary/Compensation**: Complete compensation details
11. **Other Information**: ANY other sections (team info, culture, application process, etc.)

Provide your response in the following JSON format (and ONLY this JSON format, no additional text):

\`\`\`json
{
  "title": "<exact job title>",
  "company": "<company name>",
  "companyDescription": "<COMPLETE 'About Us' or company description section>",
  "team": "<COMPLETE team/department description if present>",
  "location": "<location details>",
  "workType": "<Remote/Hybrid/On-site/Flexible>",
  "employmentType": "<Full-time/Part-time/Contract/etc.>",
  "experienceLevel": "<Junior/Mid/Senior/Lead/etc.>",
  "jobOverview": "<COMPLETE job overview/summary section - copy entire text>",
  "requirements": {
    "mustHave": [
      "<requirement 1 - COMPLETE text exactly as written>",
      "<requirement 2 - COMPLETE text exactly as written>",
      "..."
    ],
    "niceToHave": [
      "<preferred qualification 1 - COMPLETE text>",
      "<preferred qualification 2 - COMPLETE text>",
      "..."
    ]
  },
  "responsibilities": [
    "<responsibility 1 - COMPLETE text exactly as written>",
    "<responsibility 2 - COMPLETE text exactly as written>",
    "..."
  ],
  "qualifications": {
    "education": ["<education requirement 1 - complete text>", ...],
    "certifications": ["<certification requirement 1 - complete text>", ...],
    "experience": ["<experience requirement 1 - complete text>", ...],
    "skills": {
      "technical": ["<skill 1>", "<skill 2>", ...],
      "soft": ["<skill 1>", "<skill 2>", ...],
      "tools": ["<tool 1>", "<tool 2>", ...],
      "languages": ["<programming language 1>", ...]
    }
  },
  "benefits": [
    "<benefit 1 - COMPLETE text>",
    "<benefit 2 - COMPLETE text>",
    "..."
  ],
  "compensation": {
    "salary": "<salary range if mentioned>",
    "bonus": "<bonus information if mentioned>",
    "equity": "<equity/stock information if mentioned>",
    "other": "<other compensation details>"
  },
  "applicationProcess": "<application instructions if present>",
  "deadline": "<application deadline if mentioned>",
  "contactInfo": "<contact information if present>",
  "additionalInfo": {
    "<section name>": "<COMPLETE content of any other sections not covered above>"
  }
}
\`\`\`

REMEMBER: 
- Include EVERY word, EVERY bullet point, EVERY requirement from the original JD
- Do NOT summarize, abbreviate, or paraphrase anything
- If the JD has 15 bullet points under responsibilities, ALL 15 must appear in the output
- Preserve the original wording exactly`;
  }

  protected formatInput(input: JDParseInput): string {
    return `## Job Description Text:
${input.jdText}

Please parse this job description and extract structured information.`;
  }

  protected parseOutput(response: string): ParsedJD {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/(\{[\s\S]*\})/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as ParsedJD;
      } catch {
        // Continue to try parsing the entire response
      }
    }
    
    try {
      return JSON.parse(response) as ParsedJD;
    } catch {
      // Return a default structure if parsing fails
      return {
        title: '',
        company: '',
        location: '',
        requirements: [],
        responsibilities: [],
        qualifications: [],
        benefits: [],
        rawText: response,
      };
    }
  }

  /**
   * Parse a job description from text
   */
  async parse(jdText: string, requestId?: string): Promise<ParsedJD> {
    const result = await this.executeWithJsonResponse({ jdText }, jdText, requestId);
    return {
      ...result,
      rawText: jdText,
    };
  }
}

export const jdParseAgent = new JDParseAgent();
