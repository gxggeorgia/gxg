'use client';

import { useEffect, useState } from 'react';
import StatusBar from './StatusBar';

interface User {
  publicExpiry: string | null;
  role: 'escort' | 'admin';
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

          // Start polling if user exists and not already started
          if (data.user && !intervalId) {
            intervalId = setInterval(fetchUser, 20000);
          } else if (!data.user && intervalId) {
            // Stop polling if user logged out or session expired
            clearInterval(intervalId);
            intervalId = null;
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

  if (!user || user.role === 'admin') return null;

  const status = (user.publicExpiry && new Date(user.publicExpiry) > new Date()) ? 'public' : 'private';

  return <StatusBar status={status} />;
}
