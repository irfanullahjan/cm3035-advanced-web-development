import { useEffect, useState } from "react";

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateSession = async () => {
    const res = await fetch("/api/user/current");
    if (res.status === 200) {
      const userJson = await res.json();
      if (userJson.id) {
        setUser(userJson);
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    updateSession();
  }, []);

  const logout = async () => {
    await fetch("/api/user/logout");
    setUser(null);
  };

  return [user, loading, updateSession, logout];
}
