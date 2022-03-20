import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "~constants/general";
import { getCookie } from "./getCookie";

/**
 * A wrapper around the fetch function that adds content type and csrf token headers if not present.
 * @param input The url to fetch from.
 * @param init The init object to pass to the fetch function.
 * @returns A promise that resolves to the response.
 */
export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  // get headers from args
  const headers = init?.headers ? new Headers(init.headers) : new Headers();

  // if content type is not set, set it to application/json
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // if csrf token is not set, add it to headers
  if (!headers.has(CSRF_HEADER_NAME)) {
    headers.set(CSRF_HEADER_NAME, getCookie(CSRF_COOKIE_NAME));
  }

  return fetch(input, { ...init, headers });
};
