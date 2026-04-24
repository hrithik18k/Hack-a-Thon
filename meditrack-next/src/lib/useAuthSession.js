"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export function useAuthSession() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/session", {
        withCredentials: true,
        headers: { "Cache-Control": "no-store" },
      });
      setUser(data?.data || null);
    } catch (error) {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return { ready, user, refreshSession };
}

export async function logoutSession() {
  await axios.post("/api/user/logout", {}, { withCredentials: true });
}
