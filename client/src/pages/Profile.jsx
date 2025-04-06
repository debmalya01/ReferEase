import React from 'react';
import ProfileComponent from '../components/profile/Profile';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Update your profile information and preferences
        </p>
      </div>
      
      <ProfileComponent isPage={true} />
    </div>
  );
};

export default Profile; 