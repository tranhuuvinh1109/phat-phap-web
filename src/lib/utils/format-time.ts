/**
 * Formats seconds into MM:SS or HH:MM:SS string.
 *
 * @param seconds Time in seconds (can be floating point)
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSecs = String(secs).padStart(2, "0");

  if (hours > 0) {
    const paddedHours = String(hours).padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}:${paddedSecs}`;
  }

  return `${paddedMinutes}:${paddedSecs}`;
};
