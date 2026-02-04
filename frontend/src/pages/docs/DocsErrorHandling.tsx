import { useTranslation } from 'react-i18next';
import { CodeBlock } from '../../components/docs';

export default function DocsErrorHandling() {
  const { t } = useTranslation();

  const errorExample = `{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN",
  "details": {
    "field": "authorization",
    "message": "The provided API key has expired"
  }
}`;

  const errorHandlingCode = `async function callRoboHireAPI(endpoint, data) {
  try {
    const response = await fetch(\`https://api.robohire.io/v1/\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      // Handle API error
      switch (result.code) {
        case 'AUTH_REQUIRED':
        case 'INVALID_TOKEN':
          // Refresh token or redirect to login
          handleAuthError(result);
          break;
        case 'RATE_LIMITED':
          // Implement backoff and retry
          await sleep(result.retryAfter * 1000);
          return callRoboHireAPI(endpoint, data);
        case 'VALIDATION_ERROR':
          // Handle validation errors
          handleValidationError(result.details);
          break;
        default:
          throw new Error(result.error);
      }
    }

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}`;

  const errors = [
    {
      status: 400,
      code: 'BAD_REQUEST',
      description: 'The request was malformed or missing required parameters',
      fix: 'Check the request body and ensure all required fields are provided',
    },
    {
      status: 400,
      code: 'VALIDATION_ERROR',
      description: 'One or more request parameters failed validation',
      fix: 'Check the details field for specific validation errors',
    },
    {
      status: 401,
      code: 'AUTH_REQUIRED',
      description: 'No authentication credentials were provided',
      fix: 'Include an API key in the Authorization header',
    },
    {
      status: 401,
      code: 'INVALID_TOKEN',
      description: 'The provided API key is invalid or expired',
      fix: 'Check your API key or generate a new one',
    },
    {
      status: 403,
      code: 'INSUFFICIENT_SCOPES',
      description: 'The API key lacks required permissions',
      fix: 'Use an API key with the required scopes',
    },
    {
      status: 404,
      code: 'NOT_FOUND',
      description: 'The requested resource was not found',
      fix: 'Check the endpoint URL and resource ID',
    },
    {
      status: 429,
      code: 'RATE_LIMITED',
      description: 'Too many requests in a short period',
      fix: 'Implement rate limiting and retry with backoff',
    },
    {
      status: 500,
      code: 'INTERNAL_ERROR',
      description: 'An unexpected error occurred on the server',
      fix: 'Retry the request or contact support if it persists',
    },
    {
      status: 503,
      code: 'SERVICE_UNAVAILABLE',
      description: 'The service is temporarily unavailable',
      fix: 'Wait and retry the request',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t('docs.errors.title', 'Error Handling')}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('docs.errors.intro', 'Learn how to handle errors returned by the RoboHire API and implement robust error handling in your application.')}
      </p>

      {/* Error Response Format */}
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
        {t('docs.errors.format.title', 'Error Response Format')}
      </h2>
      <p className="text-gray-600 mb-4">
        {t('docs.errors.format.desc', 'When an error occurs, the API returns a JSON response with the following structure:')}
      </p>

      <CodeBlock code={errorExample} language="json" title="Error Response" />

      <div className="bg-gray-50 rounded-xl overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Field</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3"><code className="text-indigo-600">success</code></td>
              <td className="px-4 py-3 text-gray-600">Always <code>false</code> for error responses</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3"><code className="text-indigo-600">error</code></td>
              <td className="px-4 py-3 text-gray-600">Human-readable error message</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3"><code className="text-indigo-600">code</code></td>
              <td className="px-4 py-3 text-gray-600">Machine-readable error code</td>
            </tr>
            <tr>
              <td className="px-4 py-3"><code className="text-indigo-600">details</code></td>
              <td className="px-4 py-3 text-gray-600">Additional error details (optional)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Error Codes */}
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
        {t('docs.errors.codes.title', 'Error Codes Reference')}
      </h2>

      <div className="space-y-4 mb-8">
        {errors.map((error, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                error.status >= 500 ? 'bg-red-100 text-red-700' :
                error.status >= 400 ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {error.status}
              </span>
              <code className="font-mono text-gray-800">{error.code}</code>
            </div>
            <p className="text-gray-600 text-sm mb-2">{error.description}</p>
            <p className="text-sm">
              <span className="font-medium text-gray-700">Fix: </span>
              <span className="text-gray-600">{error.fix}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Handling Errors */}
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
        {t('docs.errors.handling.title', 'Handling Errors in Code')}
      </h2>
      <p className="text-gray-600 mb-4">
        {t('docs.errors.handling.desc', 'Here is an example of robust error handling:')}
      </p>

      <CodeBlock code={errorHandlingCode} language="javascript" title="Error Handling Example" />

      {/* Rate Limiting */}
      <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
        {t('docs.errors.rateLimiting.title', 'Rate Limiting')}
      </h2>
      <p className="text-gray-600 mb-4">
        {t('docs.errors.rateLimiting.desc', 'The API implements rate limiting to ensure fair usage. When you exceed the rate limit:')}
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
        <li>You will receive a <code className="bg-gray-100 px-1 rounded">429</code> status code</li>
        <li>The response includes a <code className="bg-gray-100 px-1 rounded">retryAfter</code> field (seconds until you can retry)</li>
        <li>Implement exponential backoff for automatic retries</li>
      </ul>

      {/* Best Practices */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-4">
          {t('docs.errors.bestPractices.title', 'Error Handling Best Practices')}
        </h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Always check the <code>success</code> field before processing the response
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Use the <code>code</code> field for programmatic error handling
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Log errors with context for debugging
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Implement retry logic with exponential backoff for transient errors
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Show user-friendly messages to end users, not raw error messages
          </li>
        </ul>
      </div>
    </div>
  );
}
