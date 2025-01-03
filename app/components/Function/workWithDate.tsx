export default function convertToYMD(calendarValue: any) {
  // Parse the input date string into a Date object
  const date = new Date(calendarValue);

  const formattedDate =
    date.getFullYear().toString().padStart(4, "0") +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");

  return formattedDate;
}
export function reverseDateToFormat(
  dateString: string,
  format: string
): string {
  const [year, month, day] = dateString.split("-");
  if (format === "Y") {
    return year;
  } else if (format === "M") {
    return month;
  } else {
    return `${day}-${month}-${year}`;
  }
}
