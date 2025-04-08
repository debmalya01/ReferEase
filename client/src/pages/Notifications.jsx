import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAllNotificationsAsRead } from '../store/slices/notificationSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // Group notifications by date
  const groupByDate = (notifications) => {
    const groups = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    
    return Object.entries(groups).map(([date, items]) => ({
      date,
      items
    }));
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'job_application':
        return `${notification.sender?.firstName} ${notification.sender?.lastName} applied to your job posting for "${notification.job?.title}"`;
      case 'application_accepted':
        return `Your application for "${notification.job?.title}" at ${notification.job?.company} has been accepted!`;
      case 'application_rejected':
        return `Your application for "${notification.job?.title}" at ${notification.job?.company} has been rejected.`;
      case 'job_match':
        return `New job match! "${notification.job?.title}" at ${notification.job?.company} matches your skills.`;
      default:
        return notification.message || 'New notification';
    }
  };

  const notificationGroups = groupByDate(notifications || []);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header with gradient background */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/20 via-background to-card/80 p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 hover:bg-primary/10" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-primary">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated on your job applications and referrals
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 space-x-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
            onClick={handleMarkAllAsRead}
            disabled={!notifications?.some(n => !n.isRead)}
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block p-4 bg-primary/10 rounded-full text-primary animate-pulse mb-4">
            <Bell className="h-10 w-10" />
          </div>
          <p className="text-lg text-muted-foreground">Loading notifications...</p>
        </div>
      ) : notifications?.length === 0 ? (
        <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto text-primary/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-primary/90">No Notifications Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              When you receive notifications, they will appear here. Check back later for updates on your applications.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90 transition-colors">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {notificationGroups.map((group) => (
            <div key={group.date}>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 px-4">{group.date}</h2>
              <div className="space-y-3">
                {group.items.map((notification) => (
                  <Card 
                    key={notification._id} 
                    className={`border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden
                      ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <div className={`mt-1 p-2 rounded-full ${!notification.isRead ? 'bg-primary/20 text-primary' : 'bg-secondary/30 text-muted-foreground'}`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{getNotificationMessage(notification)}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        {!notification.isRead && 
                          <Badge variant="secondary" className="bg-secondary/80 border border-primary/20">
                            New
                          </Badge>
                        }
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 