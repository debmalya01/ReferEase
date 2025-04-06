import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, MapPin, Clock, DollarSign, Briefcase, ThumbsUp, ThumbsDown } from 'lucide-react';

const JobCard = ({ job, onAccept, onReject, status }) => {
  const { title, company, location, type, experience, salary, skills, description } = job;

  const skillsList = skills.split(',').map(skill => skill.trim());

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Selected</Badge>;
      case 'selected':
        return <Badge variant="success">Selected for Referral</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{company}</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{type}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Briefcase className="h-4 w-4 mr-2" />
            <span>{experience}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{salary}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <Badge key={index} variant="secondary" className="rounded-full">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
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
            <span>Pass</span>
          </Button>
          <Button 
            className="w-full space-x-2 bg-green-600 hover:bg-green-700"
            onClick={onAccept}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Interested</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default JobCard; 