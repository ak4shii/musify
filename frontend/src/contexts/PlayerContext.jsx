import React, { createContext, useContext, useMemo, useRef, useState, useCallback, useEffect } from "react";

const PlayerContext = createContext(null);

const resolveMediaUrl = (maybeRelative) => {
  if (!maybeRelative) return null;
  try {
    new URL(maybeRelative);
    return maybeRelative;
  } catch {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    let cleanPath = maybeRelative.replace(/^\/+/, "");
    if (!cleanPath.startsWith("static/")) {
      cleanPath = "static/" + cleanPath;
    }

    const encodedParts = cleanPath.split("/").map((part) => encodeURIComponent(part));
    const encodedPath = encodedParts.join("/");

    return `${baseURL}/${encodedPath}`;
  }
};



const pickAudioSource = (track) => {
  if (!track) return null;
  const candidates = [
    track.filePath,
    track.file_path,
    track.audioUrl,
    track.streamUrl,
    track.url,
    track.audio,
    track.source,
  ].filter(Boolean);
  if (candidates.length > 0) return candidates[0];
  if (track.trackId) return `/tracks/${track.trackId}/stream`;
  if (track.id) return `/tracks/${track.id}/stream`;
  return null;
}

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const previousAudioSrcRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const playTrack = useCallback((track) => {
    if (!track) return;
    
    let isSameTrack = false;
    
    if (currentTrack) {
      if (currentTrack.id != null && track.id != null) {
        isSameTrack = currentTrack.id === track.id;
      }
      else if (currentTrack.trackId != null && track.trackId != null) {
        isSameTrack = currentTrack.trackId === track.trackId;
      }
      else if (currentTrack.filePath && track.filePath) {
        isSameTrack = currentTrack.filePath === track.filePath;
      }
      else if (currentTrack.file_path && track.file_path) {
        isSameTrack = currentTrack.file_path === track.file_path;
      }
      
      if (isSameTrack) {
        setIsPlaying(prev => !prev);
        return;
      }
    }
    
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [currentTrack]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const audioSrc = useMemo(() => {
    const picked = pickAudioSource(currentTrack);
    const resolved = resolveMediaUrl(picked);
    if (!resolved && currentTrack) {
      console.warn('No playable audio URL found for track', currentTrack);
    }
    return resolved;
  }, [currentTrack]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !audioSrc) return;

    const handlePlayPause = async () => {
      if (currentTrack && isPlaying) {
        try {
          if (audioEl.readyState >= 2) {
            await audioEl.play();
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        }
      } else {
        audioEl.pause();
      }
    };

    handlePlayPause();
  }, [currentTrack, isPlaying, audioSrc]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !audioSrc) return;
    
    const isNewTrack = previousAudioSrcRef.current !== audioSrc;
    
    if (isNewTrack) {
      setCurrentTime(0);
      previousAudioSrcRef.current = audioSrc;
      audioEl.load();
      
      const handleCanPlay = () => {
        if (isPlaying && currentTrack) {
          audioEl.play().catch((error) => {
            console.error('Error auto-playing after load:', error);
          });
        }
      };
      
      audioEl.addEventListener('canplay', handleCanPlay, { once: true });
      
      return () => {
        audioEl.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [audioSrc, isPlaying, currentTrack]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const onTime = () => {
      const time = audioEl.currentTime || 0;
      setCurrentTime(time);
    };
    const onLoaded = () => {
      const newDuration = audioEl.duration || 0;
      setDuration(newDuration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audioEl.addEventListener('timeupdate', onTime);
    audioEl.addEventListener('loadedmetadata', onLoaded);
    audioEl.addEventListener('ended', onEnded);

    let animationFrameId = null;
    const updateTime = () => {
      if (audioEl && !audioEl.paused) {
        const time = audioEl.currentTime || 0;
        setCurrentTime(time);
        animationFrameId = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(updateTime);
    }

    audioEl.volume = volume;

    return () => {
      audioEl.removeEventListener('timeupdate', onTime);
      audioEl.removeEventListener('loadedmetadata', onLoaded);
      audioEl.removeEventListener('ended', onEnded);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [volume, isPlaying]);

  const seekTo = useCallback((timeSec) => {
    const audioEl = audioRef.current;
    if (!audioEl || Number.isNaN(timeSec)) return;
    audioEl.currentTime = Math.max(0, Math.min(timeSec, duration || audioEl.duration || 0));
  }, [duration]);

  const changeVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolume(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    audioRef,
    audioSrc,
    currentTime,
    duration,
    seekTo,
    volume,
    changeVolume,
  }), [currentTrack, isPlaying, playTrack, togglePlayPause, audioSrc, currentTime, duration, seekTo, volume, changeVolume]);

  console.log("Audio source:", audioSrc);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio 
        ref={audioRef} 
        src={audioSrc || undefined} 
        preload="metadata"
        crossOrigin="anonymous"
      />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
};


