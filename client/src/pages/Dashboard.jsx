import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  BarChart3,
  Briefcase,
  Building2,
  Users,
  Star,
  Clock,
  ArrowUpRight,
  Bell,
  Search,
  FileEdit,
  MessageSquare,
  CheckCircle,
  XCircle,
  Crown,
  Calendar,
  User,
} from 'lucide-react';
import { fetchJobs, fetchReferrals } from '../store/slices/jobSlice';
import { fetchNotifications } from '../store/slices/notificationSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { jobs, referrals, loading } = useSelector((state) => state.jobs);
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (user) {
      dispatch(fetchJobs());
      dispatch(fetchReferrals());
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  // Calculate statistics
  const getStats = () => {
    const postedJobs = jobs?.filter(job => job.postedBy === user?._id) || [];
    const appliedJobs = referrals?.filter(ref => ref.applicant === user?._id) || [];
    const receivedApplications = referrals?.filter(ref => ref.job.postedBy === user?._id) || [];

    return [
      {
        title: 'Posted Jobs',
        value: postedJobs.length,
        change: '+0 this week',
        icon: <Briefcase className="h-4 w-4" />,
      },
      {
        title: 'Active Applications',
        value: appliedJobs.filter(app => app.status === 'pending').length,
        change: '+0 this week',
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: 'Received Applications',
        value: receivedApplications.filter(app => app.status === 'pending').length,
        change: '+0 this week',
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: 'Success Rate',
        value: `${Math.round((appliedJobs.filter(app => app.status === 'accepted').length / (appliedJobs.length || 1)) * 100)}%`,
        change: '+0% this month',
        icon: <Star className="h-4 w-4" />,
      },
    ];
  };

  // Get recent activities
  const getRecentActivities = () => {
    const postedJobs = jobs?.filter(job => job.postedBy === user?._id) || [];
    const appliedJobs = referrals?.filter(ref => ref.applicant === user?._id) || [];
    const receivedApplications = referrals?.filter(ref => ref.job.postedBy === user?._id) || [];

    const activities = [
      ...postedJobs.slice(0, 2).map(job => ({
        type: 'posted',
        company: job.company,
        position: job.title,
        status: 'Posted',
        time: new Date(job.createdAt).toLocaleDateString(),
      })),
      ...appliedJobs.slice(0, 2).map(ref => ({
        type: 'applied',
        company: ref.job.company,
        position: ref.job.title,
        status: ref.status,
        time: new Date(ref.createdAt).toLocaleDateString(),
      })),
      ...receivedApplications.slice(0, 2).map(ref => ({
        type: 'received',
        company: ref.job.company,
        position: ref.job.title,
        status: ref.status,
        time: new Date(ref.createdAt).toLocaleDateString(),
      })),
    ];

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 3);
  };

  // Get upcoming interviews
  const getUpcomingInterviews = () => {
    const appliedJobs = referrals?.filter(ref => ref.applicant === user?._id) || [];
    const receivedApplications = referrals?.filter(ref => ref.job.postedBy === user?._id) || [];

    const interviews = [
      ...appliedJobs
        .filter(ref => ref.status === 'accepted')
        .map(ref => ({
          company: ref.job.company,
          position: ref.job.title,
          date: new Date(ref.interviewDate).toLocaleDateString(),
          type: ref.interviewType,
          role: 'applicant',
        })),
      ...receivedApplications
        .filter(ref => ref.status === 'accepted')
        .map(ref => ({
          company: ref.job.company,
          position: ref.job.title,
          date: new Date(ref.interviewDate).toLocaleDateString(),
          type: ref.interviewType,
          role: 'interviewer',
        })),
    ];

    return interviews.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header with gradient background */}
        <div className="relative rounded-xl bg-gradient-to-r from-primary/20 via-background to-card/80 p-6 shadow-md mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's an overview of your job activities
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="space-x-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
                onClick={() => navigate('/applications')}
              >
                <Users className="h-4 w-4" />
                <span>Applications</span>
              </Button>
              <Button 
                variant="outline" 
                className="space-x-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-4 w-4" />
                <span>Notifications ({notifications?.length || 0})</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {getStats().map((stat, index) => (
            <Card key={index} className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                      <span className="text-sm text-primary/70 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity and Interviews Grid */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
            <CardHeader className="border-b border-border/30 bg-card/70 pb-4">
              <CardTitle className="text-xl font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest job-related activities</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {getRecentActivities().map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                          {activity.type === 'posted' ? (
                            <Briefcase className="h-4 w-4" />
                          ) : activity.type === 'applied' ? (
                            <Users className="h-4 w-4" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.position}</p>
                          <p className="text-sm text-muted-foreground">{activity.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          activity.status === 'Posted' ? 'outline' :
                          activity.status === 'pending' ? 'secondary' :
                          activity.status === 'accepted' ? 'success' : 'destructive'
                        } className="bg-secondary/80 border border-primary/20">
                          {activity.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {getRecentActivities().length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No recent activities</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
            <CardHeader className="border-b border-border/30 bg-card/70 pb-4">
              <CardTitle className="text-xl font-medium flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Upcoming Interviews
              </CardTitle>
              <CardDescription>Your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {getUpcomingInterviews().map((interview, index) => (
                  <div key={index} className="p-4 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{interview.position}</p>
                          <p className="text-sm text-muted-foreground">{interview.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-secondary/80 border border-primary/20">{interview.type}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{interview.date}</p>
                        <p className="text-xs text-primary/70">
                          {interview.role === 'applicant' ? 'As Applicant' : 'As Interviewer'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {getUpcomingInterviews().length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">No upcoming interviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md group overflow-hidden">
            <CardContent className="p-6 h-full">
              <div className="flex flex-col items-center text-center space-y-4 h-full">
                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
                  <Crown className="h-6 w-6" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Post a New Job</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a new job listing to find the perfect candidate
                    </p>
                  </div>
                  <Button onClick={() => navigate('/post-job')} className="w-full bg-primary hover:bg-primary/90 transition-colors">
                    Post Job
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md group overflow-hidden">
            <CardContent className="p-6 h-full">
              <div className="flex flex-col items-center text-center space-y-4 h-full">
                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
                  <Search className="h-6 w-6" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Browse Jobs</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explore available job opportunities and apply
                    </p>
                  </div>
                  <Button onClick={() => navigate('/browse-jobs')} className="w-full bg-primary hover:bg-primary/90 transition-colors">
                    Browse
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md group overflow-hidden">
            <CardContent className="p-6 h-full">
              <div className="flex flex-col items-center text-center space-y-4 h-full">
                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Edit Profile</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your profile to attract better job matches
                    </p>
                  </div>
                  <Button onClick={() => navigate('/profile')} className="w-full bg-primary hover:bg-primary/90 transition-colors">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 