import { createContext, useContext, useState, ReactNode } from 'react';

interface MatchResumeData {
  resume: string;
  jd: string;
}

interface InviteCandidateData {
  resume: string;
  jd: string;
  recruiterEmail: string;
  interviewerRequirement: string;
}

interface EvaluateInterviewData {
  resume: string;
  jd: string;
  interviewScript: string;
}

interface FormDataState {
  matchResume: MatchResumeData;
  inviteCandidate: InviteCandidateData;
  evaluateInterview: EvaluateInterviewData;
}

interface FormDataContextType {
  formData: FormDataState;
  setMatchResumeData: (data: Partial<MatchResumeData>) => void;
  setInviteCandidateData: (data: Partial<InviteCandidateData>) => void;
  setEvaluateInterviewData: (data: Partial<EvaluateInterviewData>) => void;
  clearMatchResumeData: () => void;
  clearInviteCandidateData: () => void;
  clearEvaluateInterviewData: () => void;
}

const defaultFormData: FormDataState = {
  matchResume: { resume: '', jd: '' },
  inviteCandidate: { resume: '', jd: '', recruiterEmail: '', interviewerRequirement: '' },
  evaluateInterview: { resume: '', jd: '', interviewScript: '' },
};

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormDataState>(defaultFormData);

  // Sync resume and JD across all pages when updated
  const syncResumeAndJD = (prev: FormDataState, data: { resume?: string; jd?: string }): FormDataState => {
    const updates: Partial<FormDataState> = {};
    
    if (data.resume !== undefined) {
      updates.matchResume = { ...prev.matchResume, resume: data.resume };
      updates.inviteCandidate = { ...prev.inviteCandidate, resume: data.resume };
      updates.evaluateInterview = { ...prev.evaluateInterview, resume: data.resume };
    }
    
    if (data.jd !== undefined) {
      updates.matchResume = { ...(updates.matchResume || prev.matchResume), jd: data.jd };
      updates.inviteCandidate = { ...(updates.inviteCandidate || prev.inviteCandidate), jd: data.jd };
      updates.evaluateInterview = { ...(updates.evaluateInterview || prev.evaluateInterview), jd: data.jd };
    }
    
    return { ...prev, ...updates };
  };

  const setMatchResumeData = (data: Partial<MatchResumeData>) => {
    setFormData(prev => {
      // Sync resume and JD to other pages
      const synced = syncResumeAndJD(prev, data);
      return {
        ...synced,
        matchResume: { ...synced.matchResume, ...data },
      };
    });
  };

  const setInviteCandidateData = (data: Partial<InviteCandidateData>) => {
    setFormData(prev => {
      // Sync resume and JD to other pages
      const synced = syncResumeAndJD(prev, data);
      return {
        ...synced,
        inviteCandidate: { ...synced.inviteCandidate, ...data },
      };
    });
  };

  const setEvaluateInterviewData = (data: Partial<EvaluateInterviewData>) => {
    setFormData(prev => {
      // Sync resume and JD to other pages (not interviewScript)
      const { resume, jd } = data;
      const synced = syncResumeAndJD(prev, { resume, jd });
      return {
        ...synced,
        evaluateInterview: { ...synced.evaluateInterview, ...data },
      };
    });
  };

  const clearMatchResumeData = () => {
    setFormData(prev => ({
      ...prev,
      matchResume: { resume: '', jd: '' },
      inviteCandidate: { ...prev.inviteCandidate, resume: '', jd: '' },
      evaluateInterview: { ...prev.evaluateInterview, resume: '', jd: '' },
    }));
  };

  const clearInviteCandidateData = () => {
    setFormData(prev => ({
      ...prev,
      matchResume: { resume: '', jd: '' },
      inviteCandidate: { resume: '', jd: '', recruiterEmail: prev.inviteCandidate.recruiterEmail, interviewerRequirement: '' },
      evaluateInterview: { ...prev.evaluateInterview, resume: '', jd: '' },
    }));
  };

  const clearEvaluateInterviewData = () => {
    setFormData(prev => ({
      ...prev,
      matchResume: { resume: '', jd: '' },
      inviteCandidate: { ...prev.inviteCandidate, resume: '', jd: '' },
      evaluateInterview: { resume: '', jd: '', interviewScript: '' },
    }));
  };

  return (
    <FormDataContext.Provider
      value={{
        formData,
        setMatchResumeData,
        setInviteCandidateData,
        setEvaluateInterviewData,
        clearMatchResumeData,
        clearInviteCandidateData,
        clearEvaluateInterviewData,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
}
