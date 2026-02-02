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

export default function EvaluateInterview() {
  const { formData, setEvaluateInterviewData } = useFormData();
  const { resume, jd, interviewScript } = formData.evaluateInterview;

  const setResume = (value: string) => setEvaluateInterviewData({ resume: value });
  const setJd = (value: string) => setEvaluateInterviewData({ jd: value });
  const setInterviewScript = (value: string) => setEvaluateInterviewData({ interviewScript: value });

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | undefined>();
  const [responseTime, setResponseTime] = useState<number | undefined>();

  const handleSubmit = async () => {
    if (!resume.trim() || !jd.trim() || !interviewScript.trim()) {
      setError('Please provide resume, job description, and interview transcript');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setResponseStatus(undefined);
    setResponseTime(undefined);

    const startTime = Date.now();

    try {
      const response = await axios.post('/api/v1/evaluate-interview', {
        resume,
        jd,
        interviewScript,
      });
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
        <h2 className="text-2xl font-bold text-gray-800">Evaluate Interview</h2>
        <p className="text-gray-500 mt-1">Analyze an interview transcript against resume and JD</p>
      </div>

      <ApiInfoPanel
        endpoint="/api/v1/evaluate-interview"
        method="POST"
        requestBody={{
          resume: resume.substring(0, 50) + '...',
          jd: jd.substring(0, 50) + '...',
          interviewScript: interviewScript.substring(0, 50) + '...'
        }}
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
          rows={8}
        />
        <TextArea
          label="Job Description"
          value={jd}
          onChange={setJd}
          placeholder="Paste job description here..."
          rows={8}
        />
      </div>

      <div className="mb-6">
        <TextArea
          label="Interview Transcript"
          value={interviewScript}
          onChange={setInterviewScript}
          placeholder="Paste the interview transcript here..."
          rows={10}
        />
      </div>

      <div className="mb-6">
        <Button onClick={handleSubmit} loading={loading}>
          Evaluate Interview
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Evaluation Result</h3>
        <ResultViewer data={result} loading={loading} error={error} />
      </div>
    </div>
  );
}
