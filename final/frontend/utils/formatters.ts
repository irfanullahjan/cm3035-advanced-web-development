import { genderCodeGroup } from "~constants/codeGroups";

/**
 * Returns the age in years of the given date.
 * @param dateOfBirth date of birth in format YYYY-MM-DD
 * @returns age in years
 * @source https://stackoverflow.com/a/7091965/975164
 */
export function getAgeInYears(dateOfBirth: string) {
  var today = new Date();
  var date = new Date(dateOfBirth);
  var age = today.getFullYear() - date.getFullYear();
  var m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

/**
 * Returns the
 * @param genderCode code value from genderCodeGroup e.g "M", "F", etc.
 * @returns genderName e.g. Male, Female, etc.
 * */
export const getGenderName = (genderCode: string) =>
  genderCodeGroup.find((code) => code.value === genderCode)?.name;

/**
 * Format date
 * @param date the date to be formatted
 * @returns formatted date in locale format
 */
export const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format date time
 * @param date the date to be formatted
 * @returns formatted date time in locale format
 */
export const formatTime = (date: string) => {
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });
};

export const formatDayMonth = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}
