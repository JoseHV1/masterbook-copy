export function toUtcISOString(d: Date): string {
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      0,
      0
    )
  ).toISOString();
}

export function mergeDateAndTime(date: Date, timeHHmm: string): Date {
  const [hh, mm] = (timeHHmm || '00:00').split(':').map(Number);
  const dt = new Date(date);
  dt.setHours(hh, mm, 0, 0);
  return dt;
}
