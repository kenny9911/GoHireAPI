import { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import ResultViewer from '../components/ResultViewer';
import ApiInfoPanel from '../components/ApiInfoPanel';

interface ApiResponse {
  requestId?: string;
}

export default function ParseJD() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | undefined>();
  const [responseTime, setResponseTime] = useState<number | undefined>();

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a job description PDF file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setResponseStatus(undefined);
    setResponseTime(undefined);

    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/v1/parse-jd', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
        <h2 className="text-2xl font-bold text-gray-800">Parse Job Description</h2>
        <p className="text-gray-500 mt-1">Extract structured data from a JD PDF</p>
      </div>

      <ApiInfoPanel
        endpoint="/api/v1/parse-jd"
        method="POST"
        requestBody={{ file: file?.name || '<PDF file>' }}
        responseStatus={responseStatus}
        responseTime={responseTime}
        requestId={result?.requestId}
        isLoading={loading}
      />

      <div className="mb-6 max-w-lg">
        <FileUpload
          onFileSelect={setFile}
          accept=".pdf"
          label="Upload JD PDF"
        />
      </div>

      <div className="mb-6">
        <Button onClick={handleSubmit} loading={loading} disabled={!file}>
          Parse JD
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Parsed Data</h3>
        <ResultViewer 
          data={result} 
          loading={loading} 
          error={error} 
          title={file ? `parsed-jd-${file.name.replace('.pdf', '')}` : 'parsed-jd'}
        />
      </div>
    </div>
  );
}
