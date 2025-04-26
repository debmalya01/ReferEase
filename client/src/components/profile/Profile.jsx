import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { updateProfile } from '../../store/slices/authSlice';
import { updateReferralStatus } from '../../store/slices/referralSlice';
import { 
  User, Mail, Phone, MapPin, Briefcase, Award, GraduationCap, 
  Github, Linkedin, Globe, Plus, Trash2, Save, Edit, X, ArrowLeft,
  CheckCircle, XCircle, Heart, Calendar, Check
} from 'lucide-react';

const Profile = ({ 
  viewOnly = false, 
  user: propUser, 
  onClose, 
  isPage = false, 
  isSwipeable = false, 
  referralId,
  onAccept,
  onReject
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser, loading, error } = useSelector((state) => state.auth);
  const user = propUser || authUser;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    experience: user?.experience || [],
    education: user?.education || [],
    projects: user?.projects || [],
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
  });
  
  // Local state for adding new items
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    role: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '',
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    // Remove dark mode class addition
    // Add dark mode class to document by default
    // document.documentElement.classList.add('dark');
    
    // Update local state when user data changes
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        projects: user.projects || [],
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        portfolioUrl: user.portfolioUrl || '',
      });
    }
    
    // Cleanup function
    return () => {
      // Optional: remove dark mode when component unmounts if needed
      // document.documentElement.classList.remove('dark');
    };
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Experience handlers
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExperience = () => {
    if (newExperience.role && newExperience.company) {
      setProfileData(prev => ({
        ...prev,
        experience: [...prev.experience, newExperience]
      }));
      setNewExperience({
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  };

  const handleRemoveExperience = (index) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setProfileData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation({
        degree: '',
        institution: '',
        year: '',
      });
    }
  };

  const handleRemoveEducation = (index) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Project handlers
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      setProfileData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      setNewProject({
        name: '',
        description: '',
      });
    }
  };

  const handleRemoveProject = (index) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setFormError('');
      console.log('Submitting profile data:', JSON.stringify(profileData, null, 2));
      await dispatch(updateProfile(profileData)).unwrap();
      console.log('Profile updated successfully');
      setIsEditing(false);
      if (isPage) {
        // Show success message or notification if needed
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormError(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    } else if (referralId) {
      dispatch(updateReferralStatus({ id: referralId, status: 'accepted' }));
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    } else if (referralId) {
      dispatch(updateReferralStatus({ id: referralId, status: 'rejected' }));
    }
  };

  const renderViewMode = () => (
    <div className="space-y-8 p-6">
      {/* Profile Header with Photo */}
      <div className="relative -mt-6 -mx-6 mb-6">
        <div className="h-40 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-b-xl"></div>
        <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full bg-card border-4 border-primary flex items-center justify-center overflow-hidden shadow-xl">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={`${user.firstName} ${user.lastName}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-primary/70" />
          )}
        </div>
      </div>
      
      {/* User Info */}
      <div className="pt-12 px-2">
        <h2 className="text-3xl font-bold">
          {user.firstName} {user.lastName}
        </h2>
        {user.location && (
          <div className="flex items-center mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {user.location}
          </div>
        )}
        {user.bio && (
          <p className="mt-4 text-muted-foreground">
            {user.bio}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {user.experience && user.experience.length > 0 && (
            <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 overflow-hidden shadow-md">
              <CardHeader className="border-b border-border/30 bg-card/70">
                <CardTitle className="text-xl font-medium flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {user.experience.map((exp, index) => (
                  <div key={index} className="p-5 border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium">{exp.role}</h4>
                        <p className="text-primary/80">{exp.company}</p>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </div>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-muted-foreground">{exp.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {user.education && user.education.length > 0 && (
            <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 overflow-hidden shadow-md">
              <CardHeader className="border-b border-border/30 bg-card/70">
                <CardTitle className="text-xl font-medium flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {user.education.map((edu, index) => (
                  <div key={index} className="p-5 border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors">
                    <h4 className="text-lg font-medium">{edu.degree}</h4>
                    <p className="text-primary/80">{edu.institution}</p>
                    {edu.year && (
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {edu.year}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Projects */}
          {user.projects && user.projects.length > 0 && (
            <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 overflow-hidden shadow-md">
              <CardHeader className="border-b border-border/30 bg-card/70">
                <CardTitle className="text-xl font-medium flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {user.projects.map((project, index) => (
                  <div key={index} className="p-5 border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors">
                    <h4 className="text-lg font-medium">{project.name}</h4>
                    <p className="mt-2 text-muted-foreground">{project.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md">
              <CardHeader className="border-b border-border/30 bg-card/70">
                <CardTitle className="text-xl font-medium flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-4">
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-secondary/80 border border-primary/20 py-1 px-3 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact & Social Links */}
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md">
            <CardHeader className="border-b border-border/30 bg-card/70">
              <CardTitle className="text-xl font-medium flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 px-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
                <span>{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{user.phone}</span>
                </div>
              )}
              
              <div className="flex space-x-4 mt-4 justify-center">
                {user.githubUrl && (
                  <a 
                    href={user.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-secondary/30 p-3 rounded-full hover:bg-primary/20 transition-colors text-muted-foreground hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {user.linkedinUrl && (
                  <a 
                    href={user.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-secondary/30 p-3 rounded-full hover:bg-primary/20 transition-colors text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {user.portfolioUrl && (
                  <a 
                    href={user.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-secondary/30 p-3 rounded-full hover:bg-primary/20 transition-colors text-muted-foreground hover:text-primary"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <div className="space-y-8 p-6">
      {/* Profile Banner and Photo Section */}
      <div className="relative mb-16">
        <div className="h-40 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-xl relative overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white"
          >
            <Edit className="h-3 w-3 mr-1" /> Change Banner
          </Button>
        </div>
        <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full bg-card border-4 border-primary flex items-center justify-center overflow-hidden shadow-xl">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-primary/70" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Button variant="ghost" size="sm" className="text-white">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabs for Different Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-card/70">
              <CardTitle className="text-xl font-medium flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="border-border bg-secondary h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="border-border bg-secondary h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="border-border bg-secondary h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="border-border bg-secondary h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="border-border bg-secondary h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="border-border bg-secondary min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience Card */}
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-card/70">
              <CardTitle className="text-xl font-medium flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Experience
              </CardTitle>
              <CardDescription>Your work history and professional experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-border/50 rounded-lg bg-secondary/30 group relative">
                  <button
                    onClick={() => handleRemoveExperience(index)}
                    className="absolute top-3 right-3 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex flex-col mb-3">
                    <h4 className="font-medium">{exp.role}</h4>
                    <p className="text-sm text-primary/80">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
              
              <div className="space-y-4 p-5 border border-dashed border-primary/30 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors">
                <h4 className="font-medium text-primary/80 flex items-center">
                  <Plus className="h-4 w-4 mr-1" /> Add New Experience
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={newExperience.role}
                      onChange={handleExperienceChange}
                      className="border-border bg-secondary h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={newExperience.company}
                      onChange={handleExperienceChange}
                      className="border-border bg-secondary h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newExperience.startDate}
                      onChange={handleExperienceChange}
                      className="border-border bg-secondary h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newExperience.endDate}
                      onChange={handleExperienceChange}
                      className="border-border bg-secondary h-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newExperience.description}
                    onChange={handleExperienceChange}
                    className="border-border bg-secondary min-h-[80px]"
                  />
                </div>
                <Button 
                  onClick={handleAddExperience} 
                  className="w-full bg-primary/80 hover:bg-primary text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Experience
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Skills Card */}
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-card/70">
              <CardTitle className="text-xl font-medium flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Skills
              </CardTitle>
              <CardDescription>Your professional skills and expertise</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/80 border border-primary/20 py-1 pl-3 pr-2 group">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="border-border bg-secondary h-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button onClick={handleAddSkill} size="sm" className="bg-primary/80 hover:bg-primary">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
            <CardHeader className="border-b border-border/30 bg-card/70">
              <CardTitle className="text-xl font-medium flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Social Links
              </CardTitle>
              <CardDescription>Your professional online presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="githubUrl" className="text-sm font-medium">GitHub</Label>
                </div>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  value={profileData.githubUrl}
                  onChange={handleInputChange}
                  className="border-border bg-secondary h-10"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn</Label>
                </div>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={profileData.linkedinUrl}
                  onChange={handleInputChange}
                  className="border-border bg-secondary h-10"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="portfolioUrl" className="text-sm font-medium">Portfolio</Label>
                </div>
                <Input
                  id="portfolioUrl"
                  name="portfolioUrl"
                  value={profileData.portfolioUrl}
                  onChange={handleInputChange}
                  className="border-border bg-secondary h-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Education and Projects Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Education Card */}
        <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
          <CardHeader className="border-b border-border/30 bg-card/70">
            <CardTitle className="text-xl font-medium flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-primary" />
              Education
            </CardTitle>
            <CardDescription>Your academic background</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {profileData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-border/50 rounded-lg bg-secondary/30 group relative">
                <button
                  onClick={() => handleRemoveEducation(index)}
                  className="absolute top-3 right-3 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex flex-col">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-primary/80">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.year}</p>
                </div>
              </div>
            ))}
            
            <div className="space-y-4 p-5 border border-dashed border-primary/30 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors">
              <h4 className="font-medium text-primary/80 flex items-center">
                <Plus className="h-4 w-4 mr-1" /> Add New Education
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-sm font-medium">Degree</Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={newEducation.degree}
                    onChange={handleEducationChange}
                    className="border-border bg-secondary h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-sm font-medium">Institution</Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={newEducation.institution}
                    onChange={handleEducationChange}
                    className="border-border bg-secondary h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium">Year</Label>
                <Input
                  id="year"
                  name="year"
                  value={newEducation.year}
                  onChange={handleEducationChange}
                  className="border-border bg-secondary h-10"
                />
              </div>
              <Button 
                onClick={handleAddEducation} 
                className="w-full bg-primary/80 hover:bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Education
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects Card */}
        <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
          <CardHeader className="border-b border-border/30 bg-card/70">
            <CardTitle className="text-xl font-medium flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Projects
            </CardTitle>
            <CardDescription>Your notable projects and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {profileData.projects.map((project, index) => (
              <div key={index} className="p-4 border border-border/50 rounded-lg bg-secondary/30 group relative">
                <button
                  onClick={() => handleRemoveProject(index)}
                  className="absolute top-3 right-3 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex flex-col">
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                </div>
              </div>
            ))}
            
            <div className="space-y-4 p-5 border border-dashed border-primary/30 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors">
              <h4 className="font-medium text-primary/80 flex items-center">
                <Plus className="h-4 w-4 mr-1" /> Add New Project
              </h4>
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-sm font-medium">Project Name</Label>
                <Input
                  id="projectName"
                  name="name"
                  value={newProject.name}
                  onChange={handleProjectChange}
                  className="border-border bg-secondary h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="projectDescription"
                  name="description"
                  value={newProject.description}
                  onChange={handleProjectChange}
                  className="border-border bg-secondary min-h-[80px]"
                />
              </div>
              <Button 
                onClick={handleAddProject}
                className="w-full bg-primary/80 hover:bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background text-foreground">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
          <CardDescription className="text-muted-foreground">
            Update your personal and professional information
          </CardDescription>
        </CardHeader>
        {!isSwipeable && (
          <CardHeader className="border-b border-border/30 bg-gradient-to-r from-background to-card pb-4">
            <div className="flex justify-between items-center">
              <div>
                {isPage && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mb-2 hover:bg-primary/10" 
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                  </Button>
                )}
                {!viewOnly && !isSwipeable && (
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Your Profile
                  </CardTitle>
                )}
                {!viewOnly && !isSwipeable && (
                  <CardDescription className="text-muted-foreground">
                    Manage your professional information
                  </CardDescription>
                )}
              </div>
              {!viewOnly && !isSwipeable && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 hover:bg-primary/10 hover:text-primary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-1" /> Edit Profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
        )}
        
        <CardContent className={`p-0 ${isSwipeable ? 'pb-0' : ''}`}>
          {viewOnly || !isEditing ? renderViewMode() : renderEditMode()}
          
          {isEditing && (
            <div className="flex flex-col mt-6 space-y-3 px-6 pb-6">
              {formError && (
                <div className="bg-destructive/10 p-3 rounded-md border border-destructive/30 text-destructive">
                  {formError}
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          )}
          
          {viewOnly && onClose && !isSwipeable && (
            <div className="flex justify-end mt-6 px-6 pb-6">
              <Button 
                onClick={onClose} 
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                Close
              </Button>
            </div>
          )}
          
          {isPage && !isEditing && !viewOnly && !isSwipeable && (
            <div className="flex justify-end mt-6 px-6 pb-6">
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Applicant action buttons - floating at bottom */}
      {isSwipeable && (
        <div className="fixed inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
          <div className="flex justify-center space-x-10 max-w-md mx-auto">
            <Button 
              onClick={handleReject}
              variant="outline" 
              size="lg" 
              className="w-24 h-16 rounded-full border-2 border-destructive hover:bg-destructive/10 shadow-xl transition-all duration-200 hover:scale-105"
            >
              <XCircle className="h-8 w-8 text-destructive" />
            </Button>
            
            <Button 
              onClick={handleAccept}
              variant="outline" 
              size="lg" 
              className="w-24 h-16 rounded-full border-2 border-green-500 hover:bg-green-500/10 shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Check className="h-8 w-8 text-green-500" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 