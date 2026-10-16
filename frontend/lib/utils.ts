import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
export const formatDuration = (startedAt: string, endedAt: string | null) => {
  if (!endedAt) return "In progress";

  const minutes = Math.round(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000,
  );

  if (minutes < 1) return "< 1 min";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;

  return remainingMinutes > 0
    ? `${hours} h ${remainingMinutes} min`
    : `${hours} h`;
};
