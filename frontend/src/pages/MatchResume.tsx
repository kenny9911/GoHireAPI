import { useState } from 'react';
import axios from 'axios';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import MatchResultDisplay from '../components/MatchResultDisplay';
import JsonViewer from '../components/JsonViewer';
import ApiInfoPanel from '../components/ApiInfoPanel';
import { useFormData } from '../context/FormDataContext';

interface MatchResponse {
  success: boolean;
  data: unknown;
  requestId?: string;
  error?: string;
}

type ViewMode = 'formatted' | 'json';

export default function MatchResume() {
  const { formData, setMatchResumeData } = useFormData();
  const { resume, jd } = formData.matchResume;
  
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [responseStatus, setResponseStatus] = useState<number | undefined>();
  const [responseTime, setResponseTime] = useState<number | undefined>();

  const setResume = (value: string) => setMatchResumeData({ resume: value });
  const setJd = (value: string) => setMatchResumeData({ jd: value });

  const handleSubmit = async () => {
    if (!resume.trim() || !jd.trim()) {
      setError('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setResponseStatus(undefined);
    setResponseTime(undefined);

    const startTime = Date.now();

    try {
      const response = await axios.post<MatchResponse>('/api/v1/match-resume', { resume, jd });
      setResponseTime(Date.now() - startTime);
      setResponseStatus(response.status);
      setResult(response.data);
      if (response.data.success) {
        setShowForm(false);
      }
    } catch (err) {
      setResponseTime(Date.now() - startTime);
      if (axios.isAxiosError(err)) {
        setResponseStatus(err.response?.status);
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError(err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setShowForm(true);
    setResult(null);
    setError(null);
  };

  // Show form or results
  if (!showForm && result?.success && result.data) {
    return (
      <div className="pb-8">
        {/* Header with back button and view toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Match Analysis Results</h2>
            <p className="text-gray-500 mt-1">Comprehensive candidate-job fit analysis</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('formatted')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2
                  ${viewMode === 'formatted' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Formatted
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2
                  ${viewMode === 'json' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                JSON
              </button>
            </div>
            
            {/* New Analysis Button */}
            <button
              onClick={handleNewAnalysis}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <span>←</span> New Analysis
            </button>
          </div>
        </div>

        {/* Results Display - Conditional based on view mode */}
        {viewMode === 'formatted' ? (
          <MatchResultDisplay data={result.data as any} requestId={result.requestId} />
        ) : (
          <JsonViewer data={result.data} title="match-result.json" />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Match Resume with JD</h2>
        <p className="text-gray-500 mt-1">Analyze how well a candidate's resume matches a job description</p>
      </div>

      {/* API Info Panel */}
      <ApiInfoPanel
        endpoint="/api/v1/match-resume"
        method="POST"
        requestBody={{ resume: resume.substring(0, 100) + '...', jd: jd.substring(0, 100) + '...' }}
        responseStatus={responseStatus}
        responseTime={responseTime}
        requestId={result?.requestId}
        isLoading={loading}
      />

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TextArea
          label="Resume"
          value={resume}
          onChange={setResume}
          placeholder="Paste resume content here...

Example:
John Doe
Senior Software Engineer
john.doe@email.com

EXPERIENCE:
Google (2019-2024) - Senior Software Engineer
- Led team of 5 engineers
- Built React dashboard for 10M+ users

SKILLS: Python, JavaScript, React, Node.js, AWS

EDUCATION:
MIT - BS Computer Science, 2017"
          rows={16}
        />
        <TextArea
          label="Job Description"
          value={jd}
          onChange={setJd}
          placeholder="Paste job description here...

Example:
Senior Software Engineer at TechCorp
Location: San Francisco, CA

About the role:
We are looking for a Senior Software Engineer to lead our backend team.

Required Qualifications:
- 5+ years of software engineering experience
- Expert-level Python programming
- Strong experience with React

Nice to have:
- AWS or cloud infrastructure experience
- Machine Learning background

Responsibilities:
- Lead technical design decisions
- Mentor junior engineers"
          rows={16}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} loading={loading} disabled={!resume.trim() || !jd.trim()}>
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </Button>
        {loading && (
          <span className="text-gray-500 text-sm">This may take 10-15 seconds...</span>
        )}
      </div>
    </div>
  );
}
