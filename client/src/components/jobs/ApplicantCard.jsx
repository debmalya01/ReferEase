import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Award,
  Github,
  Linkedin,
  Globe,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from 'lucide-react';

const ApplicantCard = ({ applicant, onAccept, onReject, status }) => {
  const { 
    firstName, 
    lastName, 
    email, 
    experience, 
    education,
    skills,
    projects,
    github,
    linkedin,
    portfolio,
    currentRole,
    currentCompany
  } = applicant;

  const skillsList = skills.split(',').map(skill => skill.trim());

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending Review</Badge>;
      case 'accepted':
        return <Badge variant="success">Selected for Referral</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Selected</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{firstName} {lastName}</CardTitle>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span>{email}</span>
              </div>
              {currentRole && currentCompany && (
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{currentRole} at {currentCompany}</span>
                </div>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience Section */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Experience
            </h4>
            <div className="text-sm text-muted-foreground">
              {experience}
            </div>
          </div>

          {/* Education Section */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </h4>
            <div className="text-sm text-muted-foreground">
              {education}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <Badge key={index} variant="secondary" className="rounded-full">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-2">
          <h4 className="font-medium">Notable Projects</h4>
          <div className="text-sm text-muted-foreground">
            {projects}
          </div>
        </div>

        {/* Links Section */}
        <div className="flex space-x-4">
          {github && (
            <a 
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4 mr-1" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
          {linkedin && (
            <a 
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4 mr-1" />
              <span>LinkedIn</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
          {portfolio && (
            <a 
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span>Portfolio</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      </CardContent>

      {!status && (
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="w-full border-red-200 hover:bg-red-50 hover:text-red-600 space-x-2"
            onClick={onReject}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Decline</span>
          </Button>
          <Button 
            className="w-full space-x-2 bg-green-600 hover:bg-green-700"
            onClick={onAccept}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Select for Referral</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ApplicantCard; 