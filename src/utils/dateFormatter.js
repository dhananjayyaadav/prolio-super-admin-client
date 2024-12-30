// utils/dateFormatter.js
/**
 * Format a given date to 'DDth/MMM/YYYY, Day' format.
 * @param {Date | string} date - The date to be formatted.
 * @returns {string} - The formatted date as '20th Nov 2024, Wednesday'.
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" }); // Get abbreviated month
  const year = d.getFullYear();
  const weekday = d.toLocaleString("default", { weekday: "long" }); // Get full weekday name

  // Determine day suffix (st, nd, rd, th)
  const suffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Handle 11-13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `${day}${suffix(day)} ${month} ${year}, ${weekday}`;
};
