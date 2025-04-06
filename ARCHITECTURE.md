# ReferEase - Project Architecture

## Overview
ReferEase is a platform designed to streamline the job referral process, connecting job seekers with referrers in an intuitive, dating app-inspired interface. The application allows referrers to post job opportunities and review applicants, while job seekers can browse and apply to positions.

## Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces
- **Redux Toolkit**: State management library for React applications
- **React Router**: For navigation and routing within the application
- **Shadcn UI**: Component library for styled UI elements
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: (Partial implementation) For animations and transitions
- **Axios**: For HTTP requests to the backend API
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)**: For authentication and authorization
- **Bcrypt.js**: For password hashing

### Development Tools
- **NPM/Yarn**: Package management
- **Git**: Version control
- **ESLint/Prettier**: Code formatting and linting

## High Level Design (HLD)

```
+------------------+         +------------------+         +------------------+
|                  |         |                  |         |                  |
|    Client App    | <-----> |    API Server    | <-----> |    Database      |
|    (React)       |         |    (Express)     |         |    (MongoDB)     |
|                  |         |                  |         |                  |
+------------------+         +------------------+         +------------------+
        ^                            ^                            ^
        |                            |                            |
        v                            v                            v
+------------------+         +------------------+         +------------------+
|                  |         |                  |         |                  |
|    Redux Store   |         |  Authentication  |         |   Data Models    |
|   (State Mgmt)   |         |  (JWT Tokens)    |         |   (Mongoose)     |
|                  |         |                  |         |                  |
+------------------+         +------------------+         +------------------+
```

### Client App Architecture

```
+--------------------+
|                    |
|     Components     |
|                    |
+--------------------+
         |
         v
+--------------------+     +--------------------+
|                    |     |                    |
|       Pages        | --> |   Layout/Router    |
|                    |     |                    |
+--------------------+     +--------------------+
         |                          |
         v                          v
+--------------------+     +--------------------+
|                    |     |                    |
|    Redux Slices    | <-- |    API Services    |
|                    |     |                    |
+--------------------+     +--------------------+
```

### Server Architecture

```
+--------------------+
|                    |
|    API Routes      |
|                    |
+--------------------+
         |
         v
+--------------------+     +--------------------+
|                    |     |                    |
|    Controllers     | --> |    Middleware      |
|                    |     |                    |
+--------------------+     +--------------------+
         |                          |
         v                          v
+--------------------+     +--------------------+
|                    |     |                    |
|    Data Models     | <-- |  Authentication    |
|                    |     |                    |
+--------------------+     +--------------------+
```

## Low Level Design (LLD)

### Core Entities

1. **User**
   - Attributes: email, password, firstName, lastName, role, skills, experience, education, projects, social links
   - Roles: jobseeker, referrer, recruiter

2. **Job**
   - Attributes: title, company, location, description, type, experience level, salary, skills, postedBy

3. **Referral**
   - Attributes: job, applicant, referrer, status (pending, accepted, rejected)

### State Management

```
Redux Store
├── Auth Slice
│   ├── User data
│   ├── Authentication status
│   └── Profile operations
├── Job Slice
│   ├── Jobs list
│   ├── Job details
│   └── Job CRUD operations
├── Referral Slice
│   ├── Referrals list
│   ├── Referral status updates
│   └── Applicant management
└── Notification Slice
    └── Application notifications
```

### Component Structure

```
Components
├── UI
│   ├── Button, Card, Badge, etc.
│   └── Layout components
├── Auth
│   ├── Login
│   ├── Register
│   └── AuthForm
├── Profile
│   └── Profile Component (View/Edit/Swipeable)
├── Jobs
│   ├── JobPost (Creating jobs)
│   ├── JobCard (Display job)
│   ├── JobBrowser (Browsing jobs)
│   └── JobDetails
└── Applications
    ├── ApplicantCard (Display applicant)
    ├── ApplicantReview (Review interface)
    └── ReviewApplicants (Swipe UI)
```

### API Endpoints

```
API Routes
├── Auth
│   ├── POST /api/auth/register
│   ├── POST /api/auth/login
│   └── GET /api/auth/me
├── Users
│   ├── GET /api/users/profile
│   └── PUT /api/users/profile
├── Jobs
│   ├── GET /api/jobs
│   ├── POST /api/jobs
│   ├── GET /api/jobs/:id
│   ├── PUT /api/jobs/:id
│   └── DELETE /api/jobs/:id
└── Referrals
    ├── GET /api/referrals
    ├── POST /api/referrals
    ├── GET /api/referrals/:id
    └── PUT /api/referrals/:id/status
```

### User Flow

1. **User Registration/Login**
   - User registers with email/password and basic info
   - User logs in and receives JWT token for authentication

2. **Profile Completion**
   - Users complete their profiles with professional details
   - Job seekers add skills, experience, education, etc.
   - Referrers add company info and position

3. **Job Management (Referrers)**
   - Referrers post job opportunities
   - Referrers can view and manage their job postings
   - Referrers review applicants with a swipe interface

4. **Job Application (Job Seekers)**
   - Job seekers browse job opportunities
   - Job seekers can apply to jobs
   - Job seekers can track their application status

5. **Referral Management**
   - Referrers accept or reject applicants
   - Applicants receive notifications on status updates

## Database Schema

### User Collection
```
{
  _id: ObjectId,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String, // 'jobseeker', 'referrer', 'recruiter'
  phone: String,
  location: String,
  bio: String,
  skills: [String],
  experience: [{
    role: String,
    company: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  projects: [{
    name: String,
    description: String
  }],
  githubUrl: String,
  linkedinUrl: String,
  portfolioUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Collection
```
{
  _id: ObjectId,
  title: String,
  company: String,
  location: String,
  type: String, // 'Full-time', 'Part-time', 'Contract', etc.
  experience: String, // 'Entry-level', 'Mid-level', 'Senior', etc.
  salary: String,
  description: String,
  skills: [String],
  postedBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Referral Collection
```
{
  _id: ObjectId,
  job: ObjectId, // Reference to Job
  applicant: ObjectId, // Reference to User
  referrer: ObjectId, // Reference to User
  status: String, // 'pending', 'accepted', 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

## Future Enhancements

1. **Real-time Notifications**
   - Implement WebSockets for real-time updates

2. **Advanced Matching Algorithm**
   - Implement ML-based matching between applicants and jobs

3. **Chat Functionality**
   - Direct messaging between applicants and referrers

4. **In-app Video Interviews**
   - Schedule and conduct video interviews within the platform

5. **Analytics Dashboard**
   - For tracking application status and success rates 