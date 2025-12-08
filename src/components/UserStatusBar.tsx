'use client';

import { useEffect, useState } from 'react';
import StatusBar from './StatusBar';

interface User {
  status: 'pending' | 'verified' | 'suspended';
  statusMessage?: string | null;
}

export default function UserStatusBar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile');

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          setIsLoading(false);
          return;
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchUser, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return null;

  if (!user) return null;

  return <StatusBar status={user.status} statusMessage={user.statusMessage} />;
}
