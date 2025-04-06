import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { Button } from '../ui/button';
import { Briefcase, User, LogOut, Home } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ReferEase</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Button>
                </Link>

                {user.role === 'jobseeker' && (
                  <>
                    <Link to="/jobs/browse">
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Browse Jobs</span>
                      </Button>
                    </Link>
                    <Link to="/jobs/my-applications">
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>My Applications</span>
                      </Button>
                    </Link>
                  </>
                )}

                {user.role === 'referrer' && (
                  <>
                    <Link to="/jobs/manage">
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Manage Jobs</span>
                      </Button>
                    </Link>
                  </>
                )}

                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 