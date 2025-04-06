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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your job activities
            </p>
          </div>
          <Button 
            variant="outline" 
            className="space-x-2"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-4 w-4" />
            <span>Notifications ({notifications?.length || 0})</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {getStats().map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline space-x-2">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <span className="text-sm text-green-500 font-medium">{stat.change}</span>
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
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest job-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecentActivities().map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 border border-slate-100 rounded-lg hover:border-primary/20 transition-colors">
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
                        activity.status === 'pending' ? 'default' :
                        activity.status === 'accepted' ? 'success' : 'destructive'
                      }>
                        {activity.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUpcomingInterviews().map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 border border-slate-100 rounded-lg hover:border-primary/20 transition-colors">
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
                      <Badge variant="outline">{interview.type}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{interview.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {interview.role === 'applicant' ? 'As Applicant' : 'As Interviewer'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 px-6 flex flex-col items-center space-y-2 hover:border-primary/20"
              onClick={() => navigate('/post-job')}
            >
              <Briefcase className="h-5 w-5" />
              <span>Post Job</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 px-6 flex flex-col items-center space-y-2 hover:border-primary/20"
              onClick={() => navigate('/browse-jobs')}
            >
              <Search className="h-5 w-5" />
              <span>Browse Jobs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 px-6 flex flex-col items-center space-y-2 hover:border-primary/20"
              onClick={() => navigate('/profile')}
            >
              <FileEdit className="h-5 w-5" />
              <span>Update Profile</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 px-6 flex flex-col items-center space-y-2 hover:border-primary/20"
              onClick={() => navigate('/applications')}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Applications</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 