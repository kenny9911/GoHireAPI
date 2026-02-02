# GoHire API Documentation

## Overview

GoHire API is an AI-powered recruitment platform that provides intelligent resume matching, parsing, and interview evaluation capabilities.

**Base URL:** `http://localhost:4607/api/v1`

**Content-Type:** `application/json` (except for file uploads which use `multipart/form-data`)

---

## Table of Contents

1. [Match Resume with JD](#1-match-resume-with-jd)
2. [Invite Candidate to Interview](#2-invite-candidate-to-interview)
3. [Parse Resume](#3-parse-resume)
4. [Parse Job Description](#4-parse-job-description)
5. [Evaluate Interview](#5-evaluate-interview)
6. [Health Check](#6-health-check)
7. [Statistics](#7-statistics)
8. [List Documents](#8-list-documents)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## 1. Match Resume with JD

Analyze how well a candidate's resume matches a job description. Returns detailed scoring, skill analysis, and interview recommendations.

### Endpoint

```
POST /api/v1/match-resume
```

### Request

#### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resume | string | Yes | Full text content of the candidate's resume |
| jd | string | Yes | Full text content of the job description |

#### Example Request

```bash
curl -X POST 'http://localhost:4607/api/v1/match-resume' \
  -H 'Content-Type: application/json' \
  -d '{
    "resume": "John Doe\nSenior Software Engineer\n5 years experience in Python, React, AWS...",
    "jd": "Senior Software Engineer\nRequirements: 5+ years experience, Python, React, AWS..."
  }'
```

```javascript
const response = await fetch('http://localhost:4607/api/v1/match-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resume: "John Doe\nSenior Software Engineer...",
    jd: "Senior Software Engineer\nRequirements..."
  })
});
const data = await response.json();
```

```python
import requests

response = requests.post(
    'http://localhost:4607/api/v1/match-resume',
    json={
        'resume': 'John Doe\nSenior Software Engineer...',
        'jd': 'Senior Software Engineer\nRequirements...'
    }
)
data = response.json()
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "resumeAnalysis": {
      "candidateName": "John Doe",
      "totalYearsExperience": "5 years",
      "currentRole": "Senior Software Engineer",
      "technicalSkills": ["Python", "React", "AWS", "PostgreSQL"],
      "softSkills": ["Leadership", "Communication"],
      "industries": ["Technology", "E-commerce"],
      "educationLevel": "Bachelor's in Computer Science",
      "certifications": ["AWS Solutions Architect"],
      "keyAchievements": ["Led team of 5 engineers", "Reduced latency by 40%"]
    },
    "jdAnalysis": {
      "jobTitle": "Senior Software Engineer",
      "seniorityLevel": "Senior",
      "requiredYearsExperience": "5+ years",
      "mustHaveSkills": ["Python", "React", "AWS"],
      "niceToHaveSkills": ["Kubernetes", "GraphQL"],
      "industryFocus": "Technology",
      "keyResponsibilities": ["Design scalable systems", "Mentor junior developers"]
    },
    "mustHaveAnalysis": {
      "extractedMustHaves": {
        "skills": [
          { "skill": "Python", "reason": "Core backend language", "explicitlyStated": true }
        ],
        "experiences": [
          { "experience": "5+ years software development", "reason": "Senior role requirement", "minimumYears": "5 years" }
        ],
        "qualifications": [
          { "qualification": "Bachelor's degree in CS or related field", "reason": "Standard requirement" }
        ]
      },
      "candidateEvaluation": {
        "meetsAllMustHaves": true,
        "matchedSkills": [
          { "skill": "Python", "candidateEvidence": "5 years Python experience", "proficiency": "Expert" }
        ],
        "missingSkills": [],
        "matchedExperiences": [
          { "experience": "5+ years", "candidateEvidence": "5 years at TechCorp", "exceeds": false }
        ],
        "missingExperiences": [],
        "matchedQualifications": ["Bachelor's in Computer Science"],
        "missingQualifications": []
      },
      "mustHaveScore": 95,
      "disqualified": false,
      "disqualificationReasons": [],
      "gapAnalysis": "Candidate meets all must-have requirements with strong evidence."
    },
    "niceToHaveAnalysis": {
      "extractedNiceToHaves": {
        "skills": [
          { "skill": "Kubernetes", "valueAdd": "Container orchestration experience" }
        ],
        "experiences": [],
        "qualifications": []
      },
      "candidateEvaluation": {
        "matchedSkills": [],
        "matchedExperiences": [],
        "matchedQualifications": [],
        "bonusSkills": ["Docker", "CI/CD pipelines"]
      },
      "niceToHaveScore": 40,
      "competitiveAdvantage": "Strong DevOps background provides additional value."
    },
    "skillMatch": {
      "matchedMustHave": [
        { "skill": "Python", "proficiencyLevel": "Expert", "evidenceFromResume": "Led Python backend development" }
      ],
      "missingMustHave": [],
      "matchedNiceToHave": [],
      "missingNiceToHave": ["Kubernetes"],
      "additionalRelevantSkills": ["Docker", "Redis"]
    },
    "skillMatchScore": {
      "score": 85,
      "breakdown": {
        "mustHaveScore": 95,
        "niceToHaveScore": 40,
        "depthOfExpertise": 80
      },
      "skillApplicationAnalysis": "Skills are well-applied in relevant projects.",
      "credibilityFlags": {
        "hasRedFlags": false,
        "concerns": [],
        "positiveIndicators": ["Specific metrics provided", "Clear progression"]
      }
    },
    "experienceMatch": {
      "required": "5+ years",
      "candidate": "5 years",
      "yearsGap": "Meets requirement",
      "assessment": "Experience level aligns well with requirements."
    },
    "experienceValidation": {
      "score": 88,
      "relevanceToRole": "High",
      "gaps": [],
      "strengths": [
        { "area": "Backend development", "impact": "Directly relevant to role" }
      ],
      "careerProgression": "Steady growth from junior to senior roles."
    },
    "candidatePotential": {
      "growthTrajectory": "Strong upward trajectory",
      "leadershipIndicators": ["Led team of 5", "Mentored 3 junior developers"],
      "learningAgility": "Demonstrated by learning new technologies",
      "uniqueValueProps": ["Full-stack capability", "Strong DevOps knowledge"],
      "cultureFitIndicators": ["Collaborative", "Results-oriented"],
      "riskFactors": []
    },
    "overallMatchScore": {
      "score": 85,
      "grade": "A",
      "breakdown": {
        "skillMatchWeight": 40,
        "skillMatchScore": 85,
        "experienceWeight": 35,
        "experienceScore": 88,
        "potentialWeight": 25,
        "potentialScore": 82
      },
      "confidence": "High"
    },
    "overallFit": {
      "verdict": "Strong Match",
      "summary": "Candidate is a strong match with relevant experience and skills.",
      "topReasons": ["Meets all must-have skills", "Relevant industry experience", "Leadership experience"],
      "interviewFocus": ["System design depth", "Team leadership style"],
      "hiringRecommendation": "Strongly Recommend",
      "suggestedRole": ""
    },
    "recommendations": {
      "forRecruiter": ["Proceed to technical interview", "Verify AWS certification"],
      "forCandidate": ["Highlight Kubernetes learning plans"],
      "interviewQuestions": ["Describe a complex system you designed", "How do you mentor junior developers?"]
    },
    "suggestedInterviewQuestions": {
      "technical": [
        {
          "area": "System Design",
          "subArea": "Scalability",
          "questions": [
            {
              "question": "Design a rate-limiting system for our API.",
              "purpose": "Assess system design skills",
              "lookFor": ["Distributed systems knowledge", "Trade-off analysis"],
              "followUps": ["How would you handle burst traffic?"],
              "difficulty": "Advanced",
              "timeEstimate": "15-20 minutes"
            }
          ]
        }
      ],
      "behavioral": [],
      "experienceValidation": [],
      "situational": [],
      "cultureFit": [],
      "redFlagProbing": []
    },
    "areasToProbeDeeper": [
      {
        "area": "AWS Experience Depth",
        "priority": "Medium",
        "reason": "Verify hands-on production experience",
        "subAreas": [
          {
            "name": "Infrastructure as Code",
            "specificConcerns": ["Level of Terraform/CloudFormation experience"],
            "validationQuestions": ["What IaC tools have you used in production?"],
            "greenFlags": ["Specific examples with metrics"],
            "redFlags": ["Vague answers", "Only theoretical knowledge"]
          }
        ],
        "suggestedApproach": "Start with open-ended questions, then drill into specifics."
      }
    ]
  },
  "requestId": "req_1706812345_abc123",
  "savedAs": "John_Doe_Senior_Software_Engineer_2026-02-01T12-30-45.json"
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Both resume and jd fields are required",
  "requestId": "req_1706812345_abc123"
}
```

---

## 2. Invite Candidate to Interview

Generate a personalized interview invitation email based on the candidate's resume and job description.

### Endpoint

```
POST /api/v1/invite-candidate
```

### Request

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resume | string | Yes | Full text content of the candidate's resume |
| jd | string | Yes | Full text content of the job description |

#### Example Request

```bash
curl -X POST 'http://localhost:4607/api/v1/invite-candidate' \
  -H 'Content-Type: application/json' \
  -d '{
    "resume": "John Doe\nSenior Software Engineer...",
    "jd": "Senior Software Engineer position at TechCorp..."
  }'
```

```javascript
const response = await fetch('http://localhost:4607/api/v1/invite-candidate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resume: "John Doe\nSenior Software Engineer...",
    jd: "Senior Software Engineer position at TechCorp..."
  })
});
const data = await response.json();
```

```python
import requests

response = requests.post(
    'http://localhost:4607/api/v1/invite-candidate',
    json={
        'resume': 'John Doe\nSenior Software Engineer...',
        'jd': 'Senior Software Engineer position at TechCorp...'
    }
)
data = response.json()
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "subject": "Interview Invitation: Senior Software Engineer at TechCorp",
    "body": "Dear John,\n\nThank you for your interest in the Senior Software Engineer position at TechCorp...\n\nBest regards,\nTechCorp Hiring Team"
  },
  "requestId": "req_1706812346_def456"
}
```

---

## 3. Parse Resume

Extract structured data from a resume PDF file.

### Endpoint

```
POST /api/v1/parse-resume
```

### Request

#### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | multipart/form-data | Yes |

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | file | Yes | Resume PDF file (max 10MB) |

#### Example Request

```bash
curl -X POST 'http://localhost:4607/api/v1/parse-resume' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/resume.pdf'
```

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:4607/api/v1/parse-resume', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

```python
import requests

with open('resume.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:4607/api/v1/parse-resume',
        files={'file': ('resume.pdf', f, 'application/pdf')}
    )
data = response.json()
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+1-555-123-4567",
    "location": "San Francisco, CA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "website": "johndoe.dev",
    "summary": "Senior Software Engineer with 5+ years of experience...",
    "experience": [
      {
        "title": "Senior Software Engineer",
        "company": "TechCorp",
        "location": "San Francisco, CA",
        "startDate": "2021-01",
        "endDate": "Present",
        "isCurrent": true,
        "description": "Led development of microservices architecture...",
        "achievements": [
          "Reduced API latency by 40%",
          "Led team of 5 engineers"
        ],
        "technologies": ["Python", "React", "AWS"]
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "institution": "Stanford University",
        "location": "Stanford, CA",
        "graduationDate": "2018",
        "gpa": "3.8",
        "honors": ["Magna Cum Laude"],
        "relevantCoursework": ["Distributed Systems", "Machine Learning"]
      }
    ],
    "skills": {
      "technical": ["Python", "JavaScript", "React", "AWS", "PostgreSQL"],
      "soft": ["Leadership", "Communication", "Problem Solving"],
      "languages": ["English (Native)", "Spanish (Conversational)"],
      "tools": ["Git", "Docker", "Kubernetes", "Jenkins"]
    },
    "certifications": [
      {
        "name": "AWS Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2022",
        "expirationDate": "2025",
        "credentialId": "ABC123"
      }
    ],
    "projects": [
      {
        "name": "E-commerce Platform",
        "description": "Built a scalable e-commerce platform...",
        "technologies": ["Python", "React", "AWS"],
        "url": "github.com/johndoe/ecommerce",
        "highlights": ["Handles 10k concurrent users"]
      }
    ],
    "awards": [
      {
        "name": "Employee of the Year",
        "issuer": "TechCorp",
        "date": "2023",
        "description": "Recognized for exceptional performance"
      }
    ],
    "publications": [],
    "patents": [],
    "volunteerWork": [],
    "rawText": "Full extracted text from PDF..."
  },
  "requestId": "req_1706812347_ghi789",
  "cached": false,
  "savedAs": "John_Doe_Resume.json"
}
```

#### Cached Response

If the same document was previously parsed:

```json
{
  "success": true,
  "data": { ... },
  "requestId": "req_1706812348_jkl012",
  "cached": true,
  "message": "Using cached parsed resume"
}
```

---

## 4. Parse Job Description

Extract structured data from a job description PDF file.

### Endpoint

```
POST /api/v1/parse-jd
```

### Request

#### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | multipart/form-data | Yes |

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | file | Yes | Job description PDF file (max 10MB) |

#### Example Request

```bash
curl -X POST 'http://localhost:4607/api/v1/parse-jd' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/job_description.pdf'
```

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:4607/api/v1/parse-jd', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

```python
import requests

with open('job_description.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:4607/api/v1/parse-jd',
        files={'file': ('job_description.pdf', f, 'application/pdf')}
    )
data = response.json()
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "title": "Senior Software Engineer",
    "company": "TechCorp",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "workType": "Hybrid",
    "employmentType": "Full-time",
    "experienceLevel": "Senior",
    "salaryRange": "$150,000 - $200,000",
    "companyDescription": "TechCorp is a leading technology company...",
    "teamDescription": "Join our Platform Engineering team...",
    "jobOverview": "We are looking for a Senior Software Engineer...",
    "responsibilities": [
      "Design and implement scalable backend services",
      "Mentor junior engineers",
      "Participate in architecture decisions"
    ],
    "requirements": {
      "mustHave": [
        {
          "requirement": "5+ years of software development experience",
          "category": "Experience",
          "details": "In a production environment"
        },
        {
          "requirement": "Proficiency in Python or Go",
          "category": "Technical Skill",
          "details": "Backend development"
        }
      ],
      "niceToHave": [
        {
          "requirement": "Experience with Kubernetes",
          "category": "Technical Skill",
          "details": "Container orchestration"
        }
      ]
    },
    "skills": {
      "technical": ["Python", "Go", "AWS", "PostgreSQL", "Redis"],
      "soft": ["Leadership", "Communication", "Problem Solving"]
    },
    "benefits": [
      "Competitive salary",
      "Health insurance",
      "401k matching",
      "Remote work options"
    ],
    "compensation": {
      "baseSalary": "$150,000 - $200,000",
      "bonus": "15-20% annual bonus",
      "equity": "Stock options available",
      "otherBenefits": ["Health", "401k", "PTO"]
    },
    "applicationProcess": "Submit resume and cover letter",
    "applicationDeadline": "2026-03-01",
    "contactInfo": {
      "recruiter": "Jane Smith",
      "email": "recruiting@techcorp.com"
    },
    "additionalInfo": "Equal opportunity employer",
    "rawText": "Full extracted text from PDF..."
  },
  "requestId": "req_1706812349_mno345",
  "cached": false,
  "savedAs": "Senior_Software_Engineer_TechCorp.json"
}
```

---

## 5. Evaluate Interview

Analyze an interview transcript against the candidate's resume and job description.

### Endpoint

```
POST /api/v1/evaluate-interview
```

### Request

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resume | string | Yes | Full text content of the candidate's resume |
| jd | string | Yes | Full text content of the job description |
| interviewScript | string | Yes | Full transcript of the interview |

#### Example Request

```bash
curl -X POST 'http://localhost:4607/api/v1/evaluate-interview' \
  -H 'Content-Type: application/json' \
  -d '{
    "resume": "John Doe\nSenior Software Engineer...",
    "jd": "Senior Software Engineer position...",
    "interviewScript": "Interviewer: Tell me about yourself.\nCandidate: I am a software engineer with 5 years..."
  }'
```

```javascript
const response = await fetch('http://localhost:4607/api/v1/evaluate-interview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resume: "John Doe\nSenior Software Engineer...",
    jd: "Senior Software Engineer position...",
    interviewScript: "Interviewer: Tell me about yourself..."
  })
});
const data = await response.json();
```

```python
import requests

response = requests.post(
    'http://localhost:4607/api/v1/evaluate-interview',
    json={
        'resume': 'John Doe\nSenior Software Engineer...',
        'jd': 'Senior Software Engineer position...',
        'interviewScript': 'Interviewer: Tell me about yourself...'
    }
)
data = response.json()
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "overallScore": 82,
    "technicalScore": 85,
    "communicationScore": 80,
    "cultureFitScore": 78,
    "strengths": [
      "Strong technical knowledge",
      "Clear communication",
      "Good problem-solving approach"
    ],
    "weaknesses": [
      "Could provide more specific examples",
      "Limited discussion of leadership experience"
    ],
    "keyInsights": [
      "Demonstrated deep understanding of distributed systems",
      "Showed enthusiasm for the role"
    ],
    "recommendation": "Proceed to next round",
    "suggestedNextSteps": [
      "Technical deep-dive interview",
      "Team fit interview"
    ]
  },
  "requestId": "req_1706812350_pqr678"
}
```

---

## 6. Health Check

Check the API server status and get basic statistics.

### Endpoint

```
GET /api/v1/health
```

### Request

```bash
curl 'http://localhost:4607/api/v1/health'
```

### Response

#### Success Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2026-02-01T12:30:45.123Z",
  "uptime": "2h 15m 30s",
  "llmProvider": "openrouter",
  "llmModel": "google/gemini-2.0-flash",
  "stats": {
    "totalRequests": 150,
    "successfulRequests": 145,
    "failedRequests": 5,
    "averageResponseTime": "2.5s"
  }
}
```

---

## 7. Statistics

Get detailed usage statistics.

### Endpoint

```
GET /api/v1/stats
```

### Request

```bash
curl 'http://localhost:4607/api/v1/stats'
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "totalRequests": 150,
    "totalLLMCalls": 200,
    "totalTokensUsed": 500000,
    "totalCost": 2.50,
    "averageRequestTime": 2500,
    "requestsByEndpoint": {
      "/api/v1/match-resume": 50,
      "/api/v1/parse-resume": 40,
      "/api/v1/parse-jd": 30,
      "/api/v1/invite-candidate": 20,
      "/api/v1/evaluate-interview": 10
    },
    "uptime": "2h 15m 30s"
  }
}
```

---

## 8. List Documents

List all stored parsed documents and match results.

### Endpoint

```
GET /api/v1/documents
```

### Request

```bash
curl 'http://localhost:4607/api/v1/documents'
```

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "stats": {
      "resumeCount": 15,
      "jdCount": 8,
      "matchResultCount": 25,
      "storageDir": "./parsed-documents"
    },
    "resumes": [
      {
        "id": "resume_1706812345_abc",
        "hash": "a1b2c3d4e5f6g7h8",
        "originalFilename": "John_Doe_Resume.pdf",
        "savedFilename": "John_Doe_Resume.json",
        "parsedAt": "2026-02-01T10:30:00.000Z",
        "name": "John Doe",
        "email": "john@email.com",
        "preview": "John Doe\nSenior Software Engineer..."
      }
    ],
    "jds": [
      {
        "id": "jd_1706812346_def",
        "hash": "h8g7f6e5d4c3b2a1",
        "originalFilename": "Senior_Engineer_JD.pdf",
        "savedFilename": "Senior_Engineer_JD.json",
        "parsedAt": "2026-02-01T10:35:00.000Z",
        "title": "Senior Software Engineer",
        "company": "TechCorp",
        "preview": "Senior Software Engineer at TechCorp..."
      }
    ],
    "matchResults": [
      {
        "id": "match_1706812350_ghi",
        "savedFilename": "John_Doe_Senior_Software_Engineer_2026-02-01T12-30-45.json",
        "matchedAt": "2026-02-01T12:30:45.000Z",
        "candidateName": "John Doe",
        "jobTitle": "Senior Software Engineer",
        "overallScore": 85,
        "grade": "A",
        "recommendation": "Strongly Recommend",
        "requestId": "req_1706812350_xyz"
      }
    ]
  }
}
```

---

## Error Handling

All API endpoints follow a consistent error response format.

### Error Response Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "requestId": "req_1706812345_abc123"
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |

### Common Errors

#### Missing Required Fields (400)

```json
{
  "success": false,
  "error": "Both resume and jd fields are required",
  "requestId": "req_1706812345_abc123"
}
```

#### Invalid File Type (400)

```json
{
  "success": false,
  "error": "Only PDF files are allowed",
  "requestId": "req_1706812345_abc123"
}
```

#### File Too Large (400)

```json
{
  "success": false,
  "error": "File size exceeds 10MB limit",
  "requestId": "req_1706812345_abc123"
}
```

#### LLM Service Error (500)

```json
{
  "success": false,
  "error": "Failed to process request with LLM service",
  "requestId": "req_1706812345_abc123"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. However, be mindful of LLM API costs when making requests.

### Recommendations

- Cache results where possible (resume/JD parsing is automatically cached)
- Batch operations when processing multiple documents
- Use the `/documents` endpoint to check for existing parsed documents

---

## SDKs and Libraries

### JavaScript/TypeScript

```javascript
// Example wrapper class
class GoHireAPI {
  constructor(baseUrl = 'http://localhost:4607/api/v1') {
    this.baseUrl = baseUrl;
  }

  async matchResume(resume, jd) {
    const response = await fetch(`${this.baseUrl}/match-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jd })
    });
    return response.json();
  }

  async parseResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${this.baseUrl}/parse-resume`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  async parseJD(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${this.baseUrl}/parse-jd`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  async inviteCandidate(resume, jd) {
    const response = await fetch(`${this.baseUrl}/invite-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jd })
    });
    return response.json();
  }

  async evaluateInterview(resume, jd, interviewScript) {
    const response = await fetch(`${this.baseUrl}/evaluate-interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jd, interviewScript })
    });
    return response.json();
  }
}

// Usage
const api = new GoHireAPI();
const result = await api.matchResume(resumeText, jdText);
```

### Python

```python
import requests
from typing import Optional, Dict, Any

class GoHireAPI:
    def __init__(self, base_url: str = 'http://localhost:4607/api/v1'):
        self.base_url = base_url
    
    def match_resume(self, resume: str, jd: str) -> Dict[str, Any]:
        response = requests.post(
            f'{self.base_url}/match-resume',
            json={'resume': resume, 'jd': jd}
        )
        return response.json()
    
    def parse_resume(self, file_path: str) -> Dict[str, Any]:
        with open(file_path, 'rb') as f:
            response = requests.post(
                f'{self.base_url}/parse-resume',
                files={'file': f}
            )
        return response.json()
    
    def parse_jd(self, file_path: str) -> Dict[str, Any]:
        with open(file_path, 'rb') as f:
            response = requests.post(
                f'{self.base_url}/parse-jd',
                files={'file': f}
            )
        return response.json()
    
    def invite_candidate(self, resume: str, jd: str) -> Dict[str, Any]:
        response = requests.post(
            f'{self.base_url}/invite-candidate',
            json={'resume': resume, 'jd': jd}
        )
        return response.json()
    
    def evaluate_interview(self, resume: str, jd: str, interview_script: str) -> Dict[str, Any]:
        response = requests.post(
            f'{self.base_url}/evaluate-interview',
            json={'resume': resume, 'jd': jd, 'interviewScript': interview_script}
        )
        return response.json()

# Usage
api = GoHireAPI()
result = api.match_resume(resume_text, jd_text)
```

---

## Changelog

### v1.0.0 (2026-02-01)

- Initial release
- Match Resume with JD API
- Parse Resume API (with caching)
- Parse JD API (with caching)
- Invite Candidate API
- Evaluate Interview API
- Health check and statistics endpoints
- Document listing endpoint
- Match results persistence with candidate name and job title in filename

---

## Support

For issues and feature requests, please contact the development team or create an issue in the repository.
