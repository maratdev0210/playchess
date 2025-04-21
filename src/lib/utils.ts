import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// formatted time, fraction represents the hours or minutes
// dependend on what time you want to format
export function formatTime(time: number, fraction: number): string {
  if (Math.floor(time / fraction) == 0) {
    return "00";
  } else if (Math.floor(time / fraction) < 10) {
    return "0" + String(Math.floor(time / fraction)); // e.g. 05 format, 04 format
  }
  return String(Math.floor(time / fraction));
}

export function formatSeconds(time: number): string {
  if (time % 60 == 0) {
    return "00";
  } else if (time % 60 < 10) {
    return "0" + String(time % 60);
  }
  return String(time % 60);
}
