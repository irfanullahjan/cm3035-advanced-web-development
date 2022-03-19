// from https://stackoverflow.com/a/25490531/975164
export const getCookie = (name: string) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
