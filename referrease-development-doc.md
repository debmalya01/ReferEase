# **ReferrEase - Development Documentation**

## **Table of Contents**
1. [System Architecture](#system-architecture)
2. [Monolithic Structure](#monolithic-structure)
3. [Database Design](#database-design)
4. [API Design](#api-design)
5. [Authentication & Authorization](#authentication--authorization)
6. [Frontend Components](#frontend-components)
7. [Backend Services](#backend-services)
8. [Deployment Strategy](#deployment-strategy)
9. [Testing Strategy](#testing-strategy)
10. [Performance Considerations](#performance-considerations)
11. [Security Considerations](#security-considerations)

## **System Architecture**

### **Overview**
ReferrEase will be developed as a monolithic application with a clear separation of concerns within a single codebase. The application will follow the MVC (Model-View-Controller) pattern to maintain code organization while keeping deployment simple.

### **Technology Stack**
- **Frontend**: React.js with Redux for state management
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT-based authentication with OAuth support
- **Hosting**: AWS EC2 or similar VPS
- **Web Server**: Nginx (as reverse proxy)
- **Real-time Communication**: Socket.io
- **File Storage**: AWS S3 for resume storage

### **System Components Diagram**
```
┌─────────────────────────────────────────────────────────────┐
│                     ReferrEase Monolith                      │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │  Frontend   │    │  Backend    │    │    Database     │  │
│  │  (React.js) │    │  (Node.js)  │    │    (MongoDB)    │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   Redux     │    │  Express.js │    │    Mongoose     │  │
│  │   Store     │    │    Router   │    │      ODM        │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │  Socket.io  │    │   Services  │    │  External APIs  │  │
│  │   Client    │    │             │    │                 │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## **Monolithic Structure**

### **Directory Structure**
```
referrease/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── assets/          # Images, icons, etc.
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store, actions, reducers
│   │   ├── services/        # API service clients
│   │   ├── utils/           # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                  # Backend application
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── uploads/             # Temporary file storage
│   ├── utils/               # Utility functions
│   ├── app.js               # Express application
│   └── server.js            # Entry point
├── tests/                   # Test files
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── README.md
```

### **Integration Points**
1. **Server-Side Rendering (Optional)**: Initial load performance optimization
2. **API Gateway**: Single entry point for all API requests
3. **Shared Validation Logic**: Between frontend and backend
4. **Common Utilities**: Shared between frontend and backend

## **Database Design**

### **Data Models**

**User Model**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  profilePicture: String (URL),
  role: String (referee or referrer),
  company: {
    name: String,
    position: String,
    startDate: Date,
    endDate: Date (optional)
  },
  skills: [String],
  experience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date
    }
  ],
  resumeUrl: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  preferredRoles: [String],
  preferredLocations: [String],
  isProfileComplete: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Job Model**
```javascript
{
  _id: ObjectId,
  title: String,
  company: String,
  location: String,
  description: String,
  requirements: [String],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  jobType: String (full-time, part-time, contract),
  experienceLevel: String (entry, mid, senior),
  skills: [String],
  postedBy: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Referral Model**
```javascript
{
  _id: ObjectId,
  job: ObjectId (ref: Job),
  referee: ObjectId (ref: User),
  referrer: ObjectId (ref: User),
  status: String (pending, shortlisted, referred, rejected, hired),
  notes: String,
  interactions: [
    {
      type: String (view, like, message),
      timestamp: Date,
      initiator: String (referee or referrer),
      content: String (for messages)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Notification Model**
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: User),
  type: String (new_match, shortlisted, referred, status_update),
  content: String,
  relatedTo: {
    model: String (Job, Referral, User),
    id: ObjectId
  },
  isRead: Boolean,
  createdAt: Date
}
```

**Message Model**
```javascript
{
  _id: ObjectId,
  referral: ObjectId (ref: Referral),
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  content: String,
  isRead: Boolean,
  createdAt: Date
}
```

### **Database Relationships**

1. **User to Jobs** (One-to-Many): A referrer can post many jobs
2. **User to Referrals** (One-to-Many): Both referees and referrers can have multiple referrals
3. **Job to Referrals** (One-to-Many): A job can have multiple referral applications
4. **User to Notifications** (One-to-Many): A user can receive multiple notifications
5. **Referral to Messages** (One-to-Many): A referral can have multiple messages between referee and referrer

### **Indexing Strategy**
```javascript
// User Model Indexes
{ email: 1 } // unique
{ skills: 1 } // for skill-based searches
{ "company.name": 1 } // for company-based searches
{ preferredRoles: 1 } // for role-based matching

// Job Model Indexes
{ title: 1 } // for job title searches
{ company: 1 } // for company-based searches
{ skills: 1 } // for skill-based matching
{ postedBy: 1 } // for user's posted jobs
{ isActive: 1 } // for active job filtering

// Referral Model Indexes
{ job: 1 } // for job-specific referrals
{ referee: 1 } // for referee's referrals
{ referrer: 1 } // for referrer's referrals
{ status: 1 } // for status-based filtering
{ createdAt: -1 } // for chronological sorting

// Notification Model Indexes
{ recipient: 1, isRead: 1 } // for unread notifications
{ createdAt: -1 } // for chronological sorting

// Message Model Indexes
{ referral: 1 } // for referral-specific messages
{ sender: 1, receiver: 1 } // for user conversations
{ isRead: 1 } // for unread messages
```

## **API Design**

### **RESTful Endpoints**

#### **Authentication APIs**
```
POST /api/auth/register          # Register a new user
POST /api/auth/login             # Login and get token
POST /api/auth/logout            # Logout (invalidate token)
GET /api/auth/verify-email/:token # Verify email
POST /api/auth/forgot-password   # Request password reset
POST /api/auth/reset-password    # Reset password with token
GET /api/auth/me                 # Get current user profile
```

#### **User APIs**
```
GET /api/users                   # List users (with filters)
GET /api/users/:id               # Get user by ID
PUT /api/users/:id               # Update user profile
DELETE /api/users/:id            # Delete user account
POST /api/users/:id/resume       # Upload resume
GET /api/users/:id/jobs          # Get jobs posted by user
GET /api/users/:id/referrals     # Get user's referrals
```

#### **Job APIs**
```
POST /api/jobs                   # Create a new job posting
GET /api/jobs                    # List jobs (with filters)
GET /api/jobs/:id                # Get job by ID
PUT /api/jobs/:id                # Update job details
DELETE /api/jobs/:id             # Delete job posting
GET /api/jobs/:id/referrals      # Get referrals for a job
GET /api/jobs/recommendations    # Get job recommendations for user
```

#### **Referral APIs**
```
POST /api/referrals              # Create a new referral
GET /api/referrals               # List referrals (with filters)
GET /api/referrals/:id           # Get referral by ID
PUT /api/referrals/:id           # Update referral status
DELETE /api/referrals/:id        # Delete referral
POST /api/referrals/:id/action   # Take action (shortlist, refer, reject)
GET /api/referrals/:id/messages  # Get messages for a referral
POST /api/referrals/:id/messages # Send a message
```

#### **Notification APIs**
```
GET /api/notifications           # Get user's notifications
PUT /api/notifications/:id       # Mark notification as read
DELETE /api/notifications/:id    # Delete notification
PUT /api/notifications/read-all  # Mark all notifications as read
```

#### **Recommendation APIs**
```
GET /api/recommendations/jobs    # Get job recommendations
GET /api/recommendations/referees # Get referee recommendations
GET /api/recommendations/referrers # Get referrer recommendations
```

### **WebSocket Events**

```
connect                          # User connects
disconnect                       # User disconnects
join:referral                    # Join referral chat room
leave:referral                   # Leave referral chat room
message:send                     # Send a message
message:received                 # Receive a message
notification:new                 # New notification
referral:status-update           # Referral status changed
user:online                      # User comes online
user:offline                     # User goes offline
```

### **API Request/Response Examples**

**POST /api/auth/register**
```javascript
// Request
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "referee"
}

// Response
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "60a5e4c8b4d8b52b9c5f8e4a",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "referee"
  }
}
```

**POST /api/referrals**
```javascript
// Request
{
  "jobId": "60a5e4c8b4d8b52b9c5f8e4b",
  "refereeId": "60a5e4c8b4d8b52b9c5f8e4a"
}

// Response
{
  "success": true,
  "message": "Referral request submitted.",
  "data": {
    "referralId": "60a5e4c8b4d8b52b9c5f8e4c",
    "job": {
      "id": "60a5e4c8b4d8b52b9c5f8e4b",
      "title": "Software Engineer"
    },
    "status": "pending",
    "createdAt": "2023-05-20T10:30:00.000Z"
  }
}
```

## **Authentication & Authorization**

### **JWT-based Authentication**

1. **Token Structure**
   - Header: Algorithm & token type
   - Payload: User ID, role, expiration time
   - Signature: Signed with server's secret key

2. **Token Management**
   - Access Token: Short-lived (15-30 minutes)
   - Refresh Token: Long-lived (7 days)
   - Token Storage: HTTP-only cookies for web clients

3. **Authentication Flow**
   - User login/registration → Receive tokens
   - Subsequent requests include access token
   - Token verification middleware
   - Token refresh mechanism

### **Role-based Authorization**

1. **User Roles**
   - Referee (Job Seeker)
   - Referrer (Employee)
   - Admin (System Administration)

2. **Permission Matrix**
   - Referee: View/apply for jobs, manage own profile
   - Referrer: Above + post jobs, manage referrals
   - Admin: Full system access

3. **Implementation**
   - Role middleware for route protection
   - Frontend route guards
   - UI element visibility based on permissions

## **Frontend Components**

### **Core Components**

1. **Authentication Components**
   - LoginForm
   - RegistrationForm
   - PasswordResetForm
   - ProfileSetup

2. **Job Components**
   - JobCard
   - JobSwiper
   - JobDetail
   - JobForm (for referrers)

3. **Referral Components**
   - ReferralCard
   - ReferralDetail
   - ReferralStatusTracker
   - ReferralActionButtons

4. **User Components**
   - UserProfile
   - UserCard
   - ProfileEditor
   - ResumeUploader

5. **Notification Components**
   - NotificationList
   - NotificationItem
   - RealTimeAlert

6. **Message Components**
   - ChatInterface
   - MessageList
   - MessageInput

### **Pages**

1. **Authentication Pages**
   - Login
   - Register
   - ForgotPassword
   - ResetPassword

2. **Main Pages**
   - Dashboard
   - JobExplorer
   - ReferralManager
   - ProfileSettings
   - Notifications
   - Messages

3. **Admin Pages (if needed)**
   - UserManagement
   - JobManagement
   - SystemStats

### **State Management**

1. **Redux Store Structure**
```javascript
{
  auth: {
    user: Object,
    isAuthenticated: Boolean,
    loading: Boolean,
    error: String
  },
  jobs: {
    list: Array,
    current: Object,
    recommendations: Array,
    loading: Boolean,
    error: String
  },
  referrals: {
    list: Array,
    current: Object,
    loading: Boolean,
    error: String
  },
  notifications: {
    list: Array,
    unreadCount: Number,
    loading: Boolean
  },
  messages: {
    conversations: Object,
    currentReferral: String,
    loading: Boolean
  },
  ui: {
    sidebarOpen: Boolean,
    currentTheme: String,
    modal: {
      open: Boolean,
      type: String,
      data: Object
    }
  }
}
```

## **Backend Services**

### **Core Services**

1. **AuthService**
   - User registration
   - Authentication
   - Password management
   - Token handling

2. **UserService**
   - Profile management
   - Resume processing
   - User search and filtering

3. **JobService**
   - Job posting management
   - Job search and filtering
   - Job recommendations

4. **ReferralService**
   - Referral processing
   - Status management
   - Matching algorithms

5. **NotificationService**
   - Notification creation
   - Delivery management
   - Real-time broadcasting

6. **MessageService**
   - Message handling
   - Chat history
   - Real-time communication

### **Utility Services**

1. **EmailService**
   - Email templates
   - Sending verification emails
   - Notification emails

2. **FileService**
   - Resume upload/download
   - Profile picture management
   - File validation

3. **RecommendationEngine**
   - Job-user matching
   - Similarity algorithms
   - Preference learning

4. **AnalyticsService**
   - User activity tracking
   - Referral conversion metrics
   - System performance monitoring

## **Deployment Strategy**

### **Environment Setup**

1. **Development Environment**
   - Local development with Docker
   - MongoDB local instance or Atlas
   - Local env variables (.env.development)

2. **Testing Environment**
   - CI/CD pipeline (GitHub Actions)
   - Test database
   - Automated tests before deployment

3. **Staging Environment**
   - AWS EC2 or similar
   - Staging database
   - Manual testing and verification

4. **Production Environment**
   - AWS EC2 or similar
   - Production database with replication
   - Load balancer for high availability

### **Deployment Process**

1. **Build Process**
   - Frontend build with webpack
   - Backend transpilation if using TypeScript
   - Asset optimization

2. **Deployment Script**
   - Server setup
   - Dependency installation
   - Service configuration
   - Database migrations

3. **Monitoring and Maintenance**
   - Server health monitoring
   - Database performance monitoring
   - Error tracking and logging
   - Regular backups

## **Testing Strategy**

### **Test Types**

1. **Unit Tests**
   - Component tests (React)
   - Service tests (Node.js)
   - Model tests (Mongoose)

2. **Integration Tests**
   - API endpoint tests
   - Service integration tests
   - Database interaction tests

3. **End-to-End Tests**
   - User flow tests
   - Authentication tests
   - Critical path tests

### **Testing Tools**

1. **Frontend Testing**
   - Jest for unit tests
   - React Testing Library for component tests
   - Cypress for E2E tests

2. **Backend Testing**
   - Mocha/Chai for unit and integration tests
   - Supertest for API tests
   - Sinon for mocking

3. **Test Coverage**
   - Coverage reporting with Istanbul
   - Minimum coverage thresholds
   - CI/CD integration

## **Performance Considerations**

1. **Database Optimization**
   - Proper indexing
   - Query optimization
   - Database connection pooling
   - Consider caching for frequent queries

2. **API Performance**
   - Response compression
   - Rate limiting
   - Pagination for list endpoints
   - Efficient data serialization

3. **Frontend Performance**
   - Code splitting
   - Lazy loading components
   - Image optimization
   - Cache management

4. **Scaling Strategy**
   - Vertical scaling initially
   - Horizontal scaling when needed
   - Consider future microservices transition points

## **Security Considerations**

1. **Data Protection**
   - HTTPS only
   - Data encryption at rest
   - Sensitive data handling (PII)
   - Regular security audits

2. **Authentication Security**
   - Password hashing (bcrypt)
   - JWT token security
   - CSRF protection
   - Session management

3. **API Security**
   - Input validation
   - Output sanitization
   - Rate limiting
   - API keys for external services

4. **Infrastructure Security**
   - Firewall configuration
   - Regular updates and patches
   - Principle of least privilege
   - Monitoring for suspicious activities
