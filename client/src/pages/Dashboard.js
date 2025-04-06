import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Work as WorkIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { fetchJobs } from '../store/slices/jobSlice';
import { fetchReferrals } from '../store/slices/referralSlice';
import { fetchNotifications } from '../store/slices/notificationSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.jobs);
  const { referrals } = useSelector((state) => state.referrals);
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchReferrals());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const stats = [
    {
      title: 'Active Jobs',
      value: jobs.filter(job => job.isActive).length,
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Your Referrals',
      value: referrals.filter(ref => ref.referee === user?._id).length,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'New Notifications',
      value: notifications.filter(n => !n.isRead).length,
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Unread Messages',
      value: referrals.filter(ref => ref.messages?.some(m => !m.isRead && m.receiver === user?._id)).length,
      icon: <MessageIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  const recentJobs = jobs.slice(0, 5);
  const recentReferrals = referrals.slice(0, 5);
  const recentNotifications = notifications.slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 140,
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h4" component="div">
                {stat.value}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Grid */}
      <Grid container spacing={3}>
        {/* Recent Jobs */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Jobs
              </Typography>
              <List>
                {recentJobs.map((job) => (
                  <React.Fragment key={job._id}>
                    <ListItem>
                      <ListItemText
                        primary={job.title}
                        secondary={`${job.company} • ${job.location}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" href="/jobs">
                View All Jobs
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Recent Referrals */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Referrals
              </Typography>
              <List>
                {recentReferrals.map((referral) => (
                  <React.Fragment key={referral._id}>
                    <ListItem>
                      <ListItemText
                        primary={referral.job.title}
                        secondary={`Status: ${referral.status}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" href="/referrals">
                View All Referrals
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Notifications
              </Typography>
              <List>
                {recentNotifications.map((notification) => (
                  <React.Fragment key={notification._id}>
                    <ListItem>
                      <ListItemText
                        primary={notification.content}
                        secondary={new Date(notification.createdAt).toLocaleDateString()}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" href="/notifications">
                View All Notifications
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 