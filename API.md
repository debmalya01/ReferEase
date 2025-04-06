# ReferEase API Documentation

This document provides details about the API endpoints available in the ReferEase application.

## Base URL

All API endpoints are prefixed with:

```
http://localhost:5001/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication

#### Register a new user

```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker" // "jobseeker", "referrer", or "recruiter"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "jobseeker"
  }
}
```

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "jobseeker"
  }
}
```

#### Get current user

```
GET /auth/me
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker",
  "skills": ["JavaScript", "React"],
  "experience": [...],
  "education": [...],
  "projects": [...]
}
```

### Users

#### Get user profile

```
GET /users/profile
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker",
  "phone": "123-456-7890",
  "location": "New York, NY",
  "bio": "Experienced developer...",
  "skills": ["JavaScript", "React"],
  "experience": [...],
  "education": [...],
  "projects": [...],
  "githubUrl": "https://github.com/username",
  "linkedinUrl": "https://linkedin.com/in/username",
  "portfolioUrl": "https://portfolio.com"
}
```

#### Update user profile

```
PUT /users/profile
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "123-456-7890",
  "location": "New York, NY",
  "bio": "Experienced developer...",
  "skills": ["JavaScript", "React"],
  "experience": [
    {
      "role": "Frontend Developer",
      "company": "Tech Co",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "description": "Building awesome applications"
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science",
      "institution": "University of Technology",
      "year": "2015-2019"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description here"
    }
  ],
  "githubUrl": "https://github.com/username",
  "linkedinUrl": "https://linkedin.com/in/username",
  "portfolioUrl": "https://portfolio.com"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    // Updated user object
  }
}
```

### Jobs

#### Get all jobs

```
GET /jobs
```

**Query Parameters:**
- `limit`: Number of jobs to return (default: 10)
- `page`: Page number (default: 1)
- `search`: Search term
- `skills`: Comma-separated list of skills

**Response:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "jobs": [
    {
      "id": "job_id",
      "title": "Frontend Developer",
      "company": "Tech Co",
      "location": "New York, NY",
      "type": "Full-time",
      "experience": "Mid-level",
      "salary": "$100K-$120K",
      "skills": ["JavaScript", "React", "TypeScript"],
      "description": "Job description here...",
      "postedBy": "user_id",
      "createdAt": "2023-01-15T00:00:00.000Z"
    },
    // More jobs...
  ]
}
```

#### Create a job

```
POST /jobs
```

**Request Body:**
```json
{
  "title": "Frontend Developer",
  "company": "Tech Co",
  "location": "New York, NY",
  "type": "Full-time",
  "experience": "Mid-level",
  "salary": "$100K-$120K",
  "skills": ["JavaScript", "React", "TypeScript"],
  "description": "Job description here..."
}
```

**Response:**
```json
{
  "message": "Job created successfully",
  "job": {
    "id": "job_id",
    "title": "Frontend Developer",
    "company": "Tech Co",
    // Other job details
  }
}
```

#### Get a specific job

```
GET /jobs/:id
```

**Response:**
```json
{
  "id": "job_id",
  "title": "Frontend Developer",
  "company": "Tech Co",
  "location": "New York, NY",
  "type": "Full-time",
  "experience": "Mid-level",
  "salary": "$100K-$120K",
  "skills": ["JavaScript", "React", "TypeScript"],
  "description": "Job description here...",
  "postedBy": {
    "id": "user_id",
    "firstName": "Jane",
    "lastName": "Smith"
  },
  "createdAt": "2023-01-15T00:00:00.000Z"
}
```

#### Update a job

```
PUT /jobs/:id
```

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "salary": "$120K-$140K",
  // Other fields to update
}
```

**Response:**
```json
{
  "message": "Job updated successfully",
  "job": {
    // Updated job object
  }
}
```

#### Delete a job

```
DELETE /jobs/:id
```

**Response:**
```json
{
  "message": "Job deleted successfully"
}
```

### Referrals

#### Get all referrals

```
GET /referrals
```

**Response:**
```json
{
  "referrals": [
    {
      "id": "referral_id",
      "job": {
        "id": "job_id",
        "title": "Frontend Developer",
        "company": "Tech Co"
      },
      "applicant": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe"
      },
      "status": "pending",
      "createdAt": "2023-01-20T00:00:00.000Z"
    },
    // More referrals...
  ]
}
```

#### Create a referral (Apply to a job)

```
POST /referrals
```

**Request Body:**
```json
{
  "jobId": "job_id"
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "referral": {
    "id": "referral_id",
    "job": {
      "id": "job_id",
      "title": "Frontend Developer"
    },
    "status": "pending",
    "createdAt": "2023-01-20T00:00:00.000Z"
  }
}
```

#### Get a specific referral

```
GET /referrals/:id
```

**Response:**
```json
{
  "id": "referral_id",
  "job": {
    "id": "job_id",
    "title": "Frontend Developer",
    "company": "Tech Co",
    // Other job details
  },
  "applicant": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    // Other applicant details
  },
  "status": "pending",
  "createdAt": "2023-01-20T00:00:00.000Z"
}
```

#### Update referral status

```
PUT /referrals/:id/status
```

**Request Body:**
```json
{
  "status": "accepted" // "accepted" or "rejected"
}
```

**Response:**
```json
{
  "message": "Referral status updated successfully",
  "referral": {
    // Updated referral object
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

API requests are limited to 100 requests per IP address per hour. If you exceed this limit, you will receive a 429 Too Many Requests response. 