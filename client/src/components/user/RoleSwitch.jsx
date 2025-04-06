import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { switchRole, addRole } from '../../features/user/userSlice';
import { Briefcase, User } from 'lucide-react';

const RoleSwitch = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const handleSwitchRole = (role) => {
    dispatch(switchRole(role));
  };

  const handleAddRole = (role) => {
    dispatch(addRole(role));
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {user.roles.includes('jobseeker') && user.roles.includes('referrer') ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSwitchRole(user.currentRole === 'jobseeker' ? 'referrer' : 'jobseeker')}
          disabled={loading}
        >
          {user.currentRole === 'jobseeker' ? (
            <>
              <Briefcase className="w-4 h-4 mr-2" />
              Switch to Referrer
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              Switch to Job Seeker
            </>
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddRole(user.currentRole === 'jobseeker' ? 'referrer' : 'jobseeker')}
          disabled={loading}
        >
          {user.currentRole === 'jobseeker' ? (
            <>
              <Briefcase className="w-4 h-4 mr-2" />
              Add Referrer Role
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              Add Job Seeker Role
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default RoleSwitch; 