'use client';

import ProfileCard from './ProfileCard';

const mockProfiles = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Profile ${i + 1}`,
  city: ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi'][i % 4],
  isVip: i % 3 === 0,
  isVerified: i % 2 === 0,
  isNew: i % 5 === 0,
  isOnline: i % 4 === 0,
}));

export default function ProfileGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {mockProfiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
