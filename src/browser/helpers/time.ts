export function addZero(value: number, digits = 2): string {
  return `${value}`.padStart(digits, "0");
}

export function formatTime(value: number, withSeconds = true): string {
  const hours = Math.trunc(value / 3600000);
  const minutes = Math.trunc(value / 60000) % 60;
  const seconds = Math.trunc(value / 1000) % 60;

  if (withSeconds) {
    if (hours > 0) {
      return `${hours}:${addZero(minutes)}:${addZero(seconds)}`;
    }

    return `${minutes}:${addZero(seconds)}`;
  }

  return `${hours}:${addZero(minutes)}`;
}

export function parseDuration(value: string): number {
  let result = 0;

  const add = (factor: number, input?: string) => {
    let value = 0;

    if (typeof input === "string") {
      value = Number.parseInt(input, 10);
    }

    result += value * factor;
  };

  const matches = value.match(/^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(\d+)s$/);

  if (matches) {
    add(86400000, matches[1]);
    add(3600000, matches[2]);
    add(60000, matches[3]);
    add(1000, matches[4]);
  }

  return result;
}

export function parseFormatDuration(value: string): string {
  return formatTime(parseDuration(value));
}
