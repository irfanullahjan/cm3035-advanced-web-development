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