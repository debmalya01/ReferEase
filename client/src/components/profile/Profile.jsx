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
    <div className="space-y-6">
      {/* Profile Photo - Dating App Style */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-primary/20 mb-4">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={`${user.firstName} ${user.lastName}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-primary/50" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-center">
          {user.firstName} {user.lastName}
          {user.location && (
            <span className="text-lg font-normal text-muted-foreground ml-2">
              {user.location}
            </span>
          )}
        </h2>
        {user.bio && (
          <p className="text-center text-muted-foreground mt-2 max-w-md">
            {user.bio}
          </p>
        )}
      </div>

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {user.experience && user.experience.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            Experience
          </h3>
          <div className="space-y-4">
            {user.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary/30 pl-4">
                <div className="font-medium">{exp.role}</div>
                <div className="text-muted-foreground">{exp.company}</div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
                {exp.description && (
                  <p className="mt-1 text-sm">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {user.education && user.education.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-medium flex items-center mb-3">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Education
          </h3>
          <div className="space-y-4">
            {user.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-primary/30 pl-4">
                <div className="font-medium">{edu.degree}</div>
                <div className="text-muted-foreground">{edu.institution}</div>
                {edu.year && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {edu.year}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {user.projects && user.projects.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Award className="h-5 w-5 mr-2 text-primary" />
            Projects
          </h3>
          <div className="space-y-4">
            {user.projects.map((project, index) => (
              <div key={index} className="border-l-2 border-primary/30 pl-4">
                <div className="font-medium">{project.name}</div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Social Links */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100">
        <h3 className="text-lg font-medium flex items-center mb-3">
          <Mail className="h-5 w-5 mr-2 text-primary" />
          Contact & Links
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex space-x-4 mt-3">
            {user.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github className="h-6 w-6" />
              </a>
            )}
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {user.portfolioUrl && (
              <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Globe className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
              className="border-slate-200"
              placeholder="e.g. New York, NY"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <h3 className="text-lg font-medium">Bio</h3>
        <div className="space-y-2 mt-3">
          <Textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            className="min-h-24 border-slate-200"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-medium">Skills</h3>
        <div className="space-y-2 mt-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {profileData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="pr-1">
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
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="border-slate-200"
            />
            <Button type="button" size="sm" onClick={handleAddSkill}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div>
        <h3 className="text-lg font-medium">Experience</h3>
        <div className="space-y-4 mt-3">
          {profileData.experience.map((exp, index) => (
            <div key={index} className="border border-slate-200 rounded-md p-4 pr-10 relative">
              <button
                onClick={() => handleRemoveExperience(index)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="font-medium">{exp.role}</div>
              <div className="text-muted-foreground">{exp.company}</div>
              <div className="text-sm text-muted-foreground">
                {exp.startDate} - {exp.endDate || 'Present'}
              </div>
              {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
            </div>
          ))}
          <div className="border border-dashed border-slate-200 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Add New Experience</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="role"
                value={newExperience.role}
                onChange={handleExperienceChange}
                placeholder="Job Title"
                className="border-slate-200"
              />
              <Input
                name="company"
                value={newExperience.company}
                onChange={handleExperienceChange}
                placeholder="Company"
                className="border-slate-200"
              />
              <Input
                name="startDate"
                value={newExperience.startDate}
                onChange={handleExperienceChange}
                placeholder="Start Date (e.g. Jan 2020)"
                className="border-slate-200"
              />
              <Input
                name="endDate"
                value={newExperience.endDate}
                onChange={handleExperienceChange}
                placeholder="End Date (or leave blank for current)"
                className="border-slate-200"
              />
              <div className="md:col-span-2">
                <Textarea
                  name="description"
                  value={newExperience.description}
                  onChange={handleExperienceChange}
                  placeholder="Description (optional)"
                  className="min-h-12 border-slate-200"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddExperience}
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Experience
            </Button>
          </div>
        </div>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-medium">Education</h3>
        <div className="space-y-4 mt-3">
          {profileData.education.map((edu, index) => (
            <div key={index} className="border border-slate-200 rounded-md p-4 pr-10 relative">
              <button
                onClick={() => handleRemoveEducation(index)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="font-medium">{edu.degree}</div>
              <div className="text-muted-foreground">{edu.institution}</div>
              {edu.year && <div className="text-sm text-muted-foreground">{edu.year}</div>}
            </div>
          ))}
          <div className="border border-dashed border-slate-200 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Add New Education</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="degree"
                value={newEducation.degree}
                onChange={handleEducationChange}
                placeholder="Degree / Certificate"
                className="border-slate-200"
              />
              <Input
                name="institution"
                value={newEducation.institution}
                onChange={handleEducationChange}
                placeholder="Institution"
                className="border-slate-200"
              />
              <Input
                name="year"
                value={newEducation.year}
                onChange={handleEducationChange}
                placeholder="Year (e.g. 2015-2019)"
                className="border-slate-200"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddEducation}
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Education
            </Button>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h3 className="text-lg font-medium">Projects</h3>
        <div className="space-y-4 mt-3">
          {profileData.projects.map((project, index) => (
            <div key={index} className="border border-slate-200 rounded-md p-4 pr-10 relative">
              <button
                onClick={() => handleRemoveProject(index)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="font-medium">{project.name}</div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          ))}
          <div className="border border-dashed border-slate-200 rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Add New Project</h4>
            <div className="space-y-3">
              <Input
                name="name"
                value={newProject.name}
                onChange={handleProjectChange}
                placeholder="Project Name"
                className="border-slate-200"
              />
              <Textarea
                name="description"
                value={newProject.description}
                onChange={handleProjectChange}
                placeholder="Project Description"
                className="min-h-12 border-slate-200"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleAddProject}
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Project
            </Button>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-lg font-medium">Social Links</h3>
        <div className="space-y-3 mt-3">
          <div className="flex items-center space-x-3">
            <Github className="h-5 w-5 text-muted-foreground" />
            <Input
              name="githubUrl"
              value={profileData.githubUrl}
              onChange={handleInputChange}
              placeholder="GitHub URL"
              className="border-slate-200"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Linkedin className="h-5 w-5 text-muted-foreground" />
            <Input
              name="linkedinUrl"
              value={profileData.linkedinUrl}
              onChange={handleInputChange}
              placeholder="LinkedIn URL"
              className="border-slate-200"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <Input
              name="portfolioUrl"
              value={profileData.portfolioUrl}
              onChange={handleInputChange}
              placeholder="Portfolio URL"
              className="border-slate-200"
            />
          </div>
        </div>
      </div>

      {formError && (
        <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 text-destructive">
          {formError}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <Card className={`w-full max-w-4xl mx-auto border-0 shadow-lg ${isSwipeable ? 'bg-white/95 backdrop-blur-sm' : ''}`}>
        {!isSwipeable && (
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                {isPage && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mb-2" 
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                  </Button>
                )}
                {!viewOnly && !isSwipeable && (
                  <CardTitle className="text-2xl font-bold">
                    Your Profile
                  </CardTitle>
                )}
                {!viewOnly && !isSwipeable && (
                  <CardDescription>
                    Manage your profile information
                  </CardDescription>
                )}
              </div>
              {!viewOnly && !isSwipeable && (
                <Button
                  variant="outline"
                  size="sm"
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
        
        <CardContent className={`pt-6 ${isSwipeable ? 'pb-0' : ''}`}>
          {viewOnly || !isEditing ? renderViewMode() : renderEditMode()}
          
          {isEditing && (
            <div className="flex flex-col mt-6 space-y-3">
              {formError && (
                <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 text-destructive">
                  {formError}
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          )}
          
          {viewOnly && onClose && !isSwipeable && (
            <div className="flex justify-end mt-6">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          )}
          
          {isPage && !isEditing && !viewOnly && !isSwipeable && (
            <div className="flex justify-end mt-6">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Applicant action buttons - floating at bottom */}
      {isSwipeable && (
        <div className="fixed inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background to-transparent">
          <div className="flex justify-center space-x-10 max-w-md mx-auto">
            <Button 
              onClick={handleReject}
              variant="outline" 
              size="lg" 
              className="w-24 h-14 rounded-full border-2 border-destructive hover:bg-destructive/10 shadow-lg"
            >
              <XCircle className="h-8 w-8 text-destructive" />
            </Button>
            
            <Button 
              onClick={handleAccept}
              variant="outline" 
              size="lg" 
              className="w-24 h-14 rounded-full border-2 border-green-500 hover:bg-green-50 shadow-lg"
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