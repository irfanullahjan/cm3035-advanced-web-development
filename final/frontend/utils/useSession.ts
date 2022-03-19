import { useEffect, useState } from 'react';

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const jwt = true;
    if (jwt) {
      const res = await fetch('/api/user');
      if (res.status === 200) {
        const userJson = await res.json();
        if (userJson.id) {
          setUser({ ...userJson, token: jwt });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSession();
  }, []);

  const updateSession = () => {
    loadSession();
  };

  const logout = async () => {
    await fetch('/api/user/logout');
    setUser(null);
  };

  return [user, loading, updateSession, logout];
}