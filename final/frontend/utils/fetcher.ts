export const fetcher = async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);
  
    if (!res.ok) {
      throw { status: res.status, statusText: res.statusText };
    }
  
    return res.json();
  };