# ReferEase

<p align="center">
  <img src="https://via.placeholder.com/200x200?text=ReferEase" alt="ReferEase Logo" width="200"/>
</p>

ReferEase is a modern job referral platform that connects job seekers with referrers through an intuitive, dating app-inspired interface. The application streamlines the referral process, making it easier for referrers to post job opportunities and review applicants, while allowing job seekers to browse and apply to positions.

## Features

- **Dating App-Like Interface**: Swipe through job opportunities or applicants
- **Job Posting**: Referrers can create and manage job postings
- **Applicant Review**: Tinder-style interface for accepting or rejecting applicants
- **Profile Management**: Comprehensive user profiles with experience, education, and skills
- **Application Tracking**: Monitor your job applications and referrals

## Tech Stack

- **Frontend**: React, Redux Toolkit, React Router, Shadcn UI, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/referease.git
cd referease
```

2. **Set up the environment variables**

Create `.env` files in both the client and server directories:

Server `.env`:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/referease
JWT_SECRET=your_jwt_secret
```

Client `.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
```

3. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4. **Run the development servers**

```bash
# Run the server (from the server directory)
npm run dev

# Run the client (from the client directory)
npm start
```

The client should now be running at [http://localhost:3000](http://localhost:3000) and the server at [http://localhost:5001](http://localhost:5001).

## Project Structure

```
referease/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # UI components from shadcn
│   │   │   ├── profile/     # Profile-related components
│   │   │   └── jobs/        # Job-related components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   │   └── slices/      # Redux slices
│   │   ├── styles/          # Global styles
│   │   └── App.js           # Main App component with routing
│   └── package.json         # Frontend dependencies
│
└── server/                  # Backend Express application
    ├── config/              # Configuration files
    ├── middleware/          # Express middleware
    ├── models/              # Mongoose models
    ├── routes/              # API routes
    ├── server.js            # Main server file
    └── package.json         # Backend dependencies
```

## API Documentation

For detailed API documentation, see [API.md](API.md).

## Contributing

We welcome contributions to ReferEase! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Commit your changes**
```bash
git commit -m "Add some feature"
```

4. **Push to the branch**
```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request**

## Branch Strategy

When working on the ReferEase project, we follow a structured branching strategy to keep development organized:

### Main Branches

#### `master`
- The main production branch
- Always contains stable, deployable code
- Direct commits are not allowed - changes come through pull requests

### Supporting Branches

#### `feature/*`
- Created for developing new features
- Example: `feature/feature_applicant_review_ui` or `feature/feature_job_posting_form`
- Branched from: `master`
- Merged back into: `master` (via pull request)
- Naming convention: `feature/feature_descriptive_feature_name`

#### `enhancement/*`
- Used for improving existing features
- Example: `enhancement/enhancement_profile_validation` or `enhancement/enhancement_job_card_ui`
- Branched from: `master`
- Merged back into: `master` (via pull request)
- Naming convention: `enhancement/enhancement_what_is_being_enhanced`

#### `issue/*`
- Created to fix reported issues or bugs
- Example: `issue/issue_profile_update_error` or `issue/issue_42` (using issue number)
- Branched from: `master`
- Merged back into: `master` (via pull request)
- Naming convention: `issue/issue_number_or_description`

#### `hotfix/*`
- For urgent fixes to production code
- Example: `hotfix/hotfix_auth_security_vulnerability`
- Branched from: `master`
- Merged back into: `master` (via pull request)
- Naming convention: `hotfix/hotfix_what_is_being_fixed`

### Branch Workflow Guidelines

1. **Starting a new feature/enhancement**:
   ```bash
   git checkout master
   git pull
   git checkout -b feature/your-feature-name
   ```

2. **Keeping your branch updated**:
   ```bash
   git checkout master
   git pull
   git checkout feature/your-feature-name
   git merge master
   # Resolve any conflicts
   ```

3. **Creating a Pull Request**:
   - Once your feature is complete, create a pull request via GitHub
   - Request code reviews from team members
   - After approval, merge into `master`

### Best Practices

- Keep branches focused on single features/issues
- Make regular, small commits with descriptive messages
- Pull from `master` regularly to minimize merge conflicts
- Delete branches after they've been merged

## Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Update documentation as needed
- Write or update tests as needed
- Be respectful and constructive in code reviews

## Code Style

- Use ESLint for code linting
- Follow the Airbnb JavaScript Style Guide
- Use Prettier for code formatting

## Testing

```bash
# Run tests for the client
cd client
npm test

# Run tests for the server
cd server
npm test
```

## Deployment

### Frontend Deployment

The React app can be built for production using:

```bash
cd client
npm run build
```

This will create a `build` directory with optimized production files.

### Backend Deployment

The server can be deployed to various platforms like Heroku, Railway, or Digital Ocean.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) and [Redux](https://redux.js.org/) for the frontend architecture
- [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) for the backend infrastructure 