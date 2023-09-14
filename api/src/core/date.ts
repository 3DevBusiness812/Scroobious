export function toUnixSeconds(inDate: string | Date) {
  const date = typeof inDate === 'string' ? new Date(inDate) : inDate;

  return Math.floor(date.getTime() / 1000);
}
