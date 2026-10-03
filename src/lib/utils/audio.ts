/**
 * Extracts duration in seconds from an audio File using browser HTML5 Audio API.
 *
 * @param file The audio File object
 * @returns Duration in seconds (rounded integer)
 */
export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !file) {
      return resolve(0);
    }

    try {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audio.preload = "metadata";
      audio.src = objectUrl;

      let resolved = false;
      const done = (sec: number) => {
        if (resolved) return;
        resolved = true;
        try {
          URL.revokeObjectURL(objectUrl);
          audio.removeAttribute("src");
          audio.load();
        } catch {
          // ignore
        }
        const rounded = Math.max(0, Math.round(sec));
        resolve(isNaN(rounded) ? 0 : rounded);
      };

      audio.onloadedmetadata = () => {
        if (isFinite(audio.duration) && !isNaN(audio.duration) && audio.duration > 0) {
          done(audio.duration);
        }
      };

      audio.ondurationchange = () => {
        if (isFinite(audio.duration) && !isNaN(audio.duration) && audio.duration > 0) {
          done(audio.duration);
        }
      };

      audio.onerror = () => {
        done(0);
      };

      // Fallback timeout in case metadata event does not fire within 3s
      setTimeout(() => {
        if (!resolved) {
          const dur = isFinite(audio.duration) && !isNaN(audio.duration) ? audio.duration : 0;
          done(dur);
        }
      }, 3000);
    } catch {
      resolve(0);
    }
  });
};
