export interface YouTubePlayerRef {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
}

export interface YTPlayerOptions {
  height?: string | number;
  width?: string | number;
  videoId?: string;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    enablejsapi?: 0 | 1;
    fs?: 0 | 1;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
    start?: number;
    [key: string]: unknown;
  };
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerStateChangeEvent) => void;
    onError?: (event: YTPlayerEvent) => void;
  };
}

export interface YTPlayerEvent {
  target: YTPlayerInstance;
}

export interface YTPlayerStateChangeEvent {
  target: YTPlayerInstance;
  data: number;
}

export interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string | HTMLElement, options: YTPlayerOptions) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
