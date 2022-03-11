import { useEffect, useState } from 'react';

export const ACCESS_TOKEN = 'accessToken';

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const jwt = localStorage.getItem(ACCESS_TOKEN);
    if (jwt) {
      const res = await fetch('/api/user/current', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.status === 200) {
        const userJson = await res.json();
        if (userJson.id) {
          setUser({ ...userJson, token: jwt });
        } else {
          localStorage.removeItem(ACCESS_TOKEN);
          setUser(null);
        }
      } else {
        localStorage.removeItem(ACCESS_TOKEN);
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
  return [user, loading, updateSession];
}