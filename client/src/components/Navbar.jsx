import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-10 flex items-center overflow-hidden">
                  <img 
                    src="/BackDoor_Logo_Dark1.png" 
                    alt="BackDoor Logo" 
                    className="max-h-[200%] w-auto" 
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 