import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  
  // Format date as "06 June 2025"
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  // Format time as "14:30"
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  return {
    date: formattedDate,
    time: formattedTime,
    full: `${formattedDate} at ${formattedTime}`
  };
}
