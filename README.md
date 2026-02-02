# GoHire API

AI-Powered Recruitment APIs with multi-LLM provider support.

## Features

- **5 AI-Powered APIs** for recruitment automation
- **Multi-LLM Provider Support**: OpenAI, OpenRouter, Google Gemini
- **Language Detection**: Automatically responds in the same language as the job description
- **PDF Parsing**: Extract structured data from resume and JD PDFs with caching
- **React Admin Dashboard**: Test and manage APIs through a modern UI
- **Comprehensive Logging**: File-based JSON Lines logging with daily rotation
- **Document Storage**: Automatic caching of parsed documents and match results

## Documentation

📚 **[Full API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with examples in cURL, JavaScript, and Python.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/match-resume` | POST | Match resume against job description |
| `/api/v1/invite-candidate` | POST | Generate interview invitation email |
| `/api/v1/parse-resume` | POST | Parse resume PDF to structured JSON (cached) |
| `/api/v1/parse-jd` | POST | Parse job description PDF to structured JSON (cached) |
| `/api/v1/evaluate-interview` | POST | Evaluate interview transcript |
| `/api/v1/health` | GET | Health check endpoint |
| `/api/v1/stats` | GET | Detailed usage statistics |
| `/api/v1/documents` | GET | List all stored documents |
| `/api/v1/logs` | GET | Log file information |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
# LLM Provider: openai, openrouter, or google
LLM_PROVIDER=openrouter

# LLM Model
LLM_MODEL=google/gemini-3-flash-preview

# API Keys (add the ones you need)
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key
GOOGLE_API_KEY=your_google_key
```

### Running the Application

```bash
# Run both backend and frontend
npm run dev

# Or run separately
npm run dev:backend  # Starts backend on port 4607
npm run dev:frontend # Starts frontend on port 3607
```

Access the admin dashboard at: http://localhost:3607

## API Usage Examples

### Match Resume with JD

```bash
curl -X POST http://localhost:4607/api/v1/match-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "John Doe\nSoftware Engineer with 5 years experience in Python, JavaScript...",
    "jd": "Senior Software Engineer\nRequirements: 5+ years experience, Python, AWS..."
  }'
```

### Generate Interview Invitation

```bash
curl -X POST http://localhost:4607/api/v1/invite-candidate \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Jane Smith\nEmail: jane@example.com\nFrontend Developer...",
    "jd": "Frontend Engineer at TechCorp..."
  }'
```

### Parse Resume PDF

```bash
curl -X POST http://localhost:4607/api/v1/parse-resume \
  -F "file=@resume.pdf"
```

### Parse JD PDF

```bash
curl -X POST http://localhost:4607/api/v1/parse-jd \
  -F "file=@job_description.pdf"
```

### Evaluate Interview

```bash
curl -X POST http://localhost:4607/api/v1/evaluate-interview \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "Candidate resume text...",
    "jd": "Job description text...",
    "interviewScript": "Interviewer: Tell me about yourself?\nCandidate: ..."
  }'
```

## Project Structure

```
GoHireAPI/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry
│   │   ├── routes/
│   │   │   └── api.ts            # API route definitions
│   │   ├── agents/
│   │   │   ├── BaseAgent.ts      # Abstract base agent
│   │   │   ├── ResumeMatchAgent.ts
│   │   │   ├── InviteAgent.ts
│   │   │   ├── ResumeParseAgent.ts
│   │   │   ├── JDParseAgent.ts
│   │   │   └── EvaluationAgent.ts
│   │   ├── services/
│   │   │   ├── llm/
│   │   │   │   ├── LLMService.ts
│   │   │   │   ├── OpenAIProvider.ts
│   │   │   │   ├── OpenRouterProvider.ts
│   │   │   │   └── GoogleProvider.ts
│   │   │   ├── PDFService.ts
│   │   │   ├── LanguageService.ts
│   │   │   ├── LoggerService.ts
│   │   │   └── DocumentStorageService.ts
│   │   └── types/
│   │       └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ApiInfoPanel.tsx  # API code examples (cURL, JS, Python)
│   │   │   ├── MatchResultDisplay.tsx
│   │   │   ├── JsonViewer.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── MatchResume.tsx
│   │   │   ├── ParseResume.tsx
│   │   │   ├── ParseJD.tsx
│   │   │   ├── InviteCandidate.tsx
│   │   │   └── EvaluateInterview.tsx
│   │   └── context/
│   │       └── FormDataContext.tsx
│   └── package.json
├── parsed-documents/             # Cached parsed documents
│   ├── resumes/
│   ├── jds/
│   └── match-results/
├── logs/                         # JSON Lines log files
├── API_DOCUMENTATION.md          # Full API documentation
├── .env
└── package.json
```

## Language Detection

The system automatically detects the primary language used in the Job Description and instructs the LLM to respond in that language. Supported languages include:

- English
- Chinese (中文)
- Japanese (日本語)
- Korean (한국어)
- German (Deutsch)
- French (Français)
- Spanish (Español)
- Portuguese (Português)
- Russian (Русский)
- Arabic (العربية)
- Thai (ไทย)

## License

MIT
