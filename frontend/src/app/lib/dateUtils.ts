
export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getHour = (date: Date): number => {
  return date.getHours();
};

export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Creates a Date object from a date key (YYYY-MM-DD) and an hour number.
 * Ensures the time is strictly set to HH:00:00.
 */
export const createDateFromKeyAndHour = (dateKey: string, hour: number): Date => {
  return new Date(`${dateKey}T${String(hour).padStart(2, "0")}:00:00`);
};

/**
 * Formats a date string (YYYY-MM-DD) into "M月D日(曜日)".
 */
export const formatDateWithDay = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00`);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日(${weekday})`;
};
