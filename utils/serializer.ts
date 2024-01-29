import { config } from "../config/config";

export function serializeDate(date: string | Date | null): string | null {
  if (!date) {
    return null;
  }

  const formattedDate = new Date(date);

  if (isNaN(formattedDate.getTime())) {
    // Invalid date, return null or handle it based on your requirements
    return null;
  }

  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");

  if (config.env.date.dateFormat === "dd-mm-yyyy") {
    return `${day}-${month}-${year}`;
  } else if (config.env.date.dateFormat === "yyyy-mm-dd") {
    return `${year}-${month}-${day}`;
  } else {
    // Handle other formats if needed
    return formattedDate.toISOString();
  }
}

export function serializeBoolean(data: number) {
  if (typeof data === "number") {
    return Boolean(data);
  }
}
