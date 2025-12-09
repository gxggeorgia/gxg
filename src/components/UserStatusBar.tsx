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
    let intervalId: NodeJS.Timeout | null = null;

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile');

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          // Start polling if not already started (20 seconds)
          if (!intervalId) {
            intervalId = setInterval(fetchUser, 20000);
          }
        } else if (response.status === 401) {
          setUser(null);
          // Stop polling if not authenticated
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (error) {
        // Stop polling on error
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (isLoading) return null;

  if (!user) return null;

  return <StatusBar status={user.status} statusMessage={user.statusMessage} />;
}
