import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, MapPin, Clock, DollarSign, Briefcase, ThumbsUp, ThumbsDown, Star, BookMarked, Crown } from 'lucide-react';

const JobCard = ({ job, onAccept, onReject, status }) => {
  const { title, company, location, type, experience, salary, skills, description } = job;

  const skillsList = skills.split(',').map(skill => skill.trim());

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-secondary/80 border border-primary/20">Pending</Badge>;
      case 'accepted':
        return <Badge variant="success" className="bg-green-500/20 border border-green-500/30 text-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-destructive/20 border border-destructive/30">Not Selected</Badge>;
      case 'selected':
        return <Badge variant="success" className="bg-green-500/20 border border-green-500/30 text-green-500">Selected for Referral</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden group h-full flex flex-col">
      <CardHeader className="border-b border-border/30 bg-card/70 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-medium">{title}</CardTitle>
            <div className="flex items-center text-primary/80">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{company}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge()}
            <Badge variant="outline" className="bg-secondary/80 border border-primary/20">{type}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 rounded-lg p-3 transition-colors group-hover:bg-secondary/40 flex items-center">
            <MapPin className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3 transition-colors group-hover:bg-secondary/40 flex items-center">
            <Clock className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{type}</span>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3 transition-colors group-hover:bg-secondary/40 flex items-center">
            <Briefcase className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">{experience}</span>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3 transition-colors group-hover:bg-secondary/40 flex items-center">
            <DollarSign className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">
              {salary?.min && salary?.max ? `${salary.currency} ${salary.min} - ${salary.max}` : 'Salary not specified'}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Star className="h-4 w-4 text-primary mr-1" />
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary/80 border border-primary/20 py-1 px-3 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <BookMarked className="h-4 w-4 text-primary mr-1" />
            Description
          </h4>
          <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
        </div>
      </CardContent>

      {!status && (
        <CardFooter className="grid grid-cols-2 gap-4 pt-4">
          <Button 
            variant="outline" 
            className="w-full border-border hover:bg-destructive/10 hover:text-destructive transition-colors hover:border-destructive/30 space-x-2"
            onClick={onReject}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Pass</span>
          </Button>
          <Button 
            className="w-full space-x-2 bg-primary/80 hover:bg-primary transition-colors"
            onClick={onAccept}
          >
            <Crown className="h-4 w-4" />
            <span>Interested</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default JobCard; 