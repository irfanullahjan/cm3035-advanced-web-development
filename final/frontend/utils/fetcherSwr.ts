import { fetcher } from "./fetcher";

export const fetcherSwr = async (...args: Parameters<typeof fetch>) => {

  const res = await fetcher(...args);

  if (!res.ok) {
    throw { status: res.status, statusText: res.statusText };
  }

  return res.json();
};
