import { useState } from 'react';
import axios from 'axios';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import ResultViewer from '../components/ResultViewer';
import ApiInfoPanel from '../components/ApiInfoPanel';
import { useFormData } from '../context/FormDataContext';

interface ApiResponse {
  requestId?: string;
}

export default function InviteCandidate() {
  const { formData, setInviteCandidateData } = useFormData();
  const { resume, jd } = formData.inviteCandidate;

  const setResume = (value: string) => setInviteCandidateData({ resume: value });
  const setJd = (value: string) => setInviteCandidateData({ jd: value });

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | undefined>();
  const [responseTime, setResponseTime] = useState<number | undefined>();

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
      const response = await axios.post('/api/v1/invite-candidate', { resume, jd });
      setResponseTime(Date.now() - startTime);
      setResponseStatus(response.status);
      setResult(response.data);
    } catch (err) {
      setResponseTime(Date.now() - startTime);
      if (axios.isAxiosError(err)) {
        setResponseStatus(err.response?.status);
        setError(err.response?.data?.error || err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Invite Candidate to Interview</h2>
        <p className="text-gray-500 mt-1">Generate a personalized interview invitation email</p>
      </div>

      <ApiInfoPanel
        endpoint="/api/v1/invite-candidate"
        method="POST"
        requestBody={{ resume: resume.substring(0, 100) + '...', jd: jd.substring(0, 100) + '...' }}
        responseStatus={responseStatus}
        responseTime={responseTime}
        requestId={result?.requestId}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TextArea
          label="Resume"
          value={resume}
          onChange={setResume}
          placeholder="Paste resume content here..."
          rows={12}
        />
        <TextArea
          label="Job Description"
          value={jd}
          onChange={setJd}
          placeholder="Paste job description here..."
          rows={12}
        />
      </div>

      <div className="mb-6">
        <Button onClick={handleSubmit} loading={loading}>
          Generate Invitation
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Generated Email</h3>
        <ResultViewer data={result} loading={loading} error={error} />
      </div>
    </div>
  );
}
