"use client";

import { useState, useEffect } from 'react';

interface AuthState {
  authenticated: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const { authenticated } = await res.json();
        setAuthState({ authenticated, loading: false });
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({ authenticated: false, loading: false });
      }
    };

    checkAuth();
  }, []);

  return authState;
}
