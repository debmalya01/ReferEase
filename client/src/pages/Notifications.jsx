import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAllNotificationsAsRead } from '../store/slices/notificationSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Bell, CheckCheck } from 'lucide-react';

const Notifications = () => {
  const dispatch = useDispatch();
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your job applications and referrals</p>
        </div>
        <Button 
          variant="outline" 
          className="space-x-2"
          onClick={handleMarkAllAsRead}
          disabled={!notifications?.some(n => !n.isRead)}
        >
          <CheckCheck className="h-4 w-4" />
          <span>Mark all as read</span>
        </Button>
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications?.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <Bell className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No notifications yet</h3>
            <p className="text-muted-foreground">When you receive notifications, they will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {notificationGroups.map((group) => (
            <div key={group.date}>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">{group.date}</h2>
              <div className="space-y-3">
                {group.items.map((notification) => (
                  <Card 
                    key={notification._id} 
                    className={`border-0 shadow-sm transition-all hover:shadow ${!notification.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <div className={`mt-1 p-2 rounded-full ${!notification.isRead ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{getNotificationMessage(notification)}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        {!notification.isRead && <Badge variant="outline">New</Badge>}
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