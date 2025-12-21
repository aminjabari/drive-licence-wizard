import { useState, useEffect } from 'react';

export interface WpUser {
  username: string;
  phone: string;
}

declare global {
  interface Window {
    wpUser?: WpUser;
  }
}

export function useWordPressUser() {
  const [wpUser, setWpUser] = useState<WpUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for WordPress user data in global variable
    if (typeof window !== 'undefined' && window.wpUser) {
      const { username, phone } = window.wpUser;
      if (username && phone) {
        setWpUser({ username, phone });
        setIsLoggedIn(true);
      }
    }
  }, []);

  return { wpUser, isLoggedIn };
}
