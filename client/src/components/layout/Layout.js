import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { 
  Bell, 
  Menu as MenuIcon, 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  User,
  LogOut,
  MessageSquare,
  Settings,
  ChevronDown,
  Crown
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchNotifications());
    // Add dark mode class to document
    document.documentElement.classList.add('dark');
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
    { text: 'Browse Jobs', icon: <Briefcase className="h-5 w-5" />, path: '/browse-jobs' },
    { text: 'Post Jobs', icon: <Briefcase className="h-5 w-5" />, path: '/post-job' },
    { text: 'Applications', icon: <Users className="h-5 w-5" />, path: '/applications' },
    { text: 'Messages', icon: <MessageSquare className="h-5 w-5" />, path: '/messages' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-card border-r border-border">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              ReferEase
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.text}
                  to={item.path}
                  className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-secondary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-muted-foreground mr-3">{item.icon}</span>
                  <span>{item.text}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm rounded-md hover:bg-secondary transition-colors text-left"
              >
                <span className="text-muted-foreground mr-3">
                  <LogOut className="h-5 w-5" />
                </span>
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            ReferEase
          </h1>
        </div>
        <div className="py-4 flex-1">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.text}
                to={item.path}
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-secondary transition-colors"
              >
                <span className="text-muted-foreground mr-3">{item.icon}</span>
                <span>{item.text}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm rounded-md hover:bg-secondary transition-colors text-left"
          >
            <span className="text-muted-foreground mr-3">
              <LogOut className="h-5 w-5" />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border h-16 flex items-center px-4">
          <div className="flex-1 flex items-center">
            {/* Mobile menu button */}
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={handleDrawerToggle}>
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <h1 className="ml-4 lg:ml-0 text-lg font-semibold">
              {menuItems.find(item => item.path === window.location.pathname)?.text || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
              <Badge 
                variant="secondary" 
                className={`absolute -mt-6 ml-4 ${unreadCount ? '' : 'hidden'}`}
              >
                {unreadCount}
              </Badge>
              <Bell className="h-5 w-5" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback>{getInitials(user?.firstName)}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 