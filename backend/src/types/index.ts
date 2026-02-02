// LLM Types
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  requestId?: string;
}

export interface LLMUsageInfo {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMResponse {
  content: string;
  usage: LLMUsageInfo;
  model: string;
}

export interface LLMProvider {
  chat(messages: Message[], options?: LLMOptions): Promise<LLMResponse>;
  getProviderName(): string;
}

// Resume Types - Expanded to preserve all content
export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  address?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[] | SkillsDetailed;
  experience: WorkExperience[];
  projects?: Project[];
  education: Education[];
  certifications?: Certification[];
  awards?: Award[];
  languages?: LanguageSkill[];
  volunteerWork?: VolunteerWork[];
  publications?: string[];
  patents?: string[];
  summary?: string;
  otherSections?: Record<string, string>;
  rawText?: string;
}

export interface SkillsDetailed {
  technical?: string[];
  soft?: string[];
  languages?: string[];
  tools?: string[];
  frameworks?: string[];
  other?: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  duration: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

export interface Project {
  name: string;
  role?: string;
  date?: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  year: string;
  gpa?: string;
  achievements?: string[];
  coursework?: string[];
}

export interface Certification {
  name: string;
  issuer?: string;
  date?: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Award {
  name: string;
  issuer?: string;
  date?: string;
  description?: string;
}

export interface LanguageSkill {
  language: string;
  proficiency?: string;
}

export interface VolunteerWork {
  organization: string;
  role?: string;
  duration?: string;
  description?: string;
}

// JD Types - Expanded to preserve all content
export interface ParsedJD {
  title: string;
  company: string;
  companyDescription?: string;
  team?: string;
  location: string;
  workType?: string;
  employmentType?: string;
  experienceLevel?: string;
  jobOverview?: string;
  requirements: string[] | RequirementsDetailed;
  responsibilities: string[];
  qualifications: string[] | QualificationsDetailed;
  benefits: string[];
  compensation?: CompensationInfo;
  salary?: string;
  applicationProcess?: string;
  deadline?: string;
  contactInfo?: string;
  additionalInfo?: Record<string, string>;
  rawText?: string;
}

export interface RequirementsDetailed {
  mustHave?: string[];
  niceToHave?: string[];
}

export interface QualificationsDetailed {
  education?: string[];
  certifications?: string[];
  experience?: string[];
  skills?: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    languages?: string[];
  };
}

export interface CompensationInfo {
  salary?: string;
  bonus?: string;
  equity?: string;
  other?: string;
}

// Match Result Types - Enhanced Analysis
export interface MatchResult {
  resumeAnalysis: {
    candidateName: string;
    totalYearsExperience: string;
    currentRole: string;
    technicalSkills: string[];
    softSkills: string[];
    industries: string[];
    educationLevel: string;
    certifications: string[];
    keyAchievements: string[];
  };
  jdAnalysis: {
    jobTitle: string;
    seniorityLevel: string;
    requiredYearsExperience: string;
    mustHaveSkills: string[];
    niceToHaveSkills: string[];
    industryFocus: string;
    keyResponsibilities: string[];
  };
  mustHaveAnalysis: {
    extractedMustHaves: {
      skills: Array<{
        skill: string;
        reason: string;
        explicitlyStated: boolean;
      }>;
      experiences: Array<{
        experience: string;
        reason: string;
        minimumYears: string;
      }>;
      qualifications: Array<{
        qualification: string;
        reason: string;
      }>;
    };
    candidateEvaluation: {
      meetsAllMustHaves: boolean;
      matchedSkills: Array<{
        skill: string;
        candidateEvidence: string;
        proficiency: string;
      }>;
      missingSkills: Array<{
        skill: string;
        severity: string;
        canBeLearnedQuickly: boolean;
        alternativeEvidence: string;
      }>;
      matchedExperiences: Array<{
        experience: string;
        candidateEvidence: string;
        exceeds: boolean;
      }>;
      missingExperiences: Array<{
        experience: string;
        severity: string;
        gap: string;
        partiallyMet: string;
      }>;
      matchedQualifications: string[];
      missingQualifications: Array<{
        qualification: string;
        severity: string;
        alternative: string;
      }>;
    };
    mustHaveScore: number;
    disqualified: boolean;
    disqualificationReasons: string[];
    gapAnalysis: string;
  };
  niceToHaveAnalysis: {
    extractedNiceToHaves: {
      skills: Array<{
        skill: string;
        valueAdd: string;
      }>;
      experiences: Array<{
        experience: string;
        valueAdd: string;
      }>;
      qualifications: Array<{
        qualification: string;
        valueAdd: string;
      }>;
    };
    candidateEvaluation: {
      matchedSkills: string[];
      matchedExperiences: string[];
      matchedQualifications: string[];
      bonusSkills: string[];
    };
    niceToHaveScore: number;
    competitiveAdvantage: string;
  };
  skillMatch: {
    matchedMustHave: Array<{
      skill: string;
      proficiencyLevel: string;
      evidenceFromResume: string;
    }>;
    missingMustHave: Array<{
      skill: string;
      importance: string;
      mitigationPossibility: string;
    }>;
    matchedNiceToHave: string[];
    missingNiceToHave: string[];
    additionalRelevantSkills: string[];
  };
  skillMatchScore: {
    score: number;
    breakdown: {
      mustHaveScore: number;
      niceToHaveScore: number;
      depthOfExpertise: number;
    };
    skillApplicationAnalysis: string;
    credibilityFlags: {
      hasRedFlags: boolean;
      concerns: string[];
      positiveIndicators: string[];
    };
  };
  experienceMatch: {
    required: string;
    candidate: string;
    yearsGap: string;
    assessment: string;
  };
  experienceValidation: {
    score: number;
    relevanceToRole: string;
    gaps: Array<{
      area: string;
      severity: string;
      canBeAddressed: string;
    }>;
    strengths: Array<{
      area: string;
      impact: string;
    }>;
    careerProgression: string;
  };
  candidatePotential: {
    growthTrajectory: string;
    leadershipIndicators: string[];
    learningAgility: string;
    uniqueValueProps: string[];
    cultureFitIndicators: string[];
    riskFactors: string[];
  };
  overallMatchScore: {
    score: number;
    grade: string;
    breakdown: {
      skillMatchWeight: number;
      skillMatchScore: number;
      experienceWeight: number;
      experienceScore: number;
      potentialWeight: number;
      potentialScore: number;
    };
    confidence: string;
  };
  overallFit: {
    verdict: string;
    summary: string;
    topReasons: string[];
    interviewFocus: string[];
    hiringRecommendation: string;
    suggestedRole: string;
  };
  recommendations: {
    forRecruiter: string[];
    forCandidate: string[];
    interviewQuestions: string[]; // Legacy simple format
  };
  suggestedInterviewQuestions: {
    technical: InterviewQuestionCategory[];
    behavioral: InterviewQuestionCategory[];
    experienceValidation: InterviewQuestionCategory[];
    situational: InterviewQuestionCategory[];
    cultureFit: InterviewQuestionCategory[];
    redFlagProbing: InterviewQuestionCategory[];
  };
  areasToProbeDeeper: ProbingArea[];
}

export interface InterviewQuestionCategory {
  area: string;
  subArea?: string;
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  question: string;
  purpose: string;
  lookFor: string[];
  followUps: string[];
  difficulty: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  timeEstimate: string;
}

export interface ProbingArea {
  area: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  reason: string;
  subAreas: ProbingSubArea[];
  suggestedApproach: string;
}

export interface ProbingSubArea {
  name: string;
  specificConcerns: string[];
  validationQuestions: string[];
  greenFlags: string[];
  redFlags: string[];
}

// Invitation Types
export interface InvitationEmail {
  subject: string;
  body: string;
}

// Interview Evaluation Types
export interface InterviewEvaluation {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  cultureFitScore: number;
  strengths: string[];
  weaknesses: string[];
  keyInsights: string[];
  hiringRecommendation: string;
  suggestedFollowUp: string[];
}

// API Request Types
export interface MatchResumeRequest {
  resume: string;
  jd: string;
}

export interface InviteCandidateRequest {
  resume: string;
  jd: string;
}

export interface EvaluateInterviewRequest {
  resume: string;
  jd: string;
  interviewScript: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
