import { fetcher } from "./fetcher";

/**
 * Fetches data from the server and returns a promise that resolves to json data.
 * This is a wrapper around the fetch function to be used with the SWR library.
 * @param input The url to fetch from.
 * @param init The init object to pass to the fetch function.
 * @returns A promise that resolves to the json data.
 */
export const fetcherSwr = async (...args: Parameters<typeof fetch>) => {
  const res = await fetcher(...args);

  if (!res.ok) {
    throw { status: res.status, statusText: res.statusText };
  }

  return res.json();
};
