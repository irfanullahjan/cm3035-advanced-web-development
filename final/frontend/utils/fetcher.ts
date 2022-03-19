import { CSRF_COOKIE_NAME } from "~constants/strings";
import { getCookie } from "./getCookie";

export const fetcher = async (...args: Parameters<typeof fetch>) => {

  // get headers from args
  let headers = args[1]?.headers ?? new Headers();

  // add csrf token to headers
  headers = new Headers({
    ...headers,
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCookie(CSRF_COOKIE_NAME)
  });

  // add headers to args
  args[1] = {
    ...args[1],
    headers
  };

  return fetch(...args);
};
