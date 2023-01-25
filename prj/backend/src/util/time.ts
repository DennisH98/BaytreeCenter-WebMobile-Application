export const getCurrentDateInTimezone = (timezone: string) => {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: timezone,
    })
  );
};

export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInMonth = (year: number, month: number) => {
  return [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month];
};

export const addMonths = (date: Date, value: number) => {
  var d = new Date(date),
    n = date.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + value);
  d.setDate(Math.min(n, getDaysInMonth(d.getFullYear(), d.getMonth())));
  return d;
};
