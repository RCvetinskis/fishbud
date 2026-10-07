"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export type CurrentUser = {
  id: number;
  email: string;
  username: string;
  created_at: string;
};

type UseCurrentUserResult = {
  user: CurrentUser | null;
  loading: boolean;
  error: boolean;
};

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await axios.get("/api/auth/current_user");

        if (!response.data) {
          throw new Error("Unauthorized");
        }

        const result = await response.data;

        if (mounted) {
          setUser(result.data);
        }
      } catch {
        if (mounted) {
          setError(true);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,
    error,
  };
}
