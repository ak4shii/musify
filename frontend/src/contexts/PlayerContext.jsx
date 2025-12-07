import React, { createContext, useContext, useMemo, useRef, useState, useCallback, useEffect } from "react";
import apiClient, { resolveMediaUrl } from "../helpers/apiClient";

const PlayerContext = createContext(null);

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

const resolveTrackNumericId = (track) => {
  if (!track || typeof track !== 'object') return null;
  return track.trackId ?? track.id ?? null;
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const previousAudioSrcRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [trackPool, setTrackPool] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadPool = async () => {
      try {
        const headers = {};
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await apiClient.get('/', { headers });
        const pool = res?.data?.tracks || [];
        if (isMounted) setTrackPool(pool);
      } catch (err) {
        console.warn('Unable to load track pool for random next:', err?.message || err);
      }
    };
    loadPool();
    return () => { isMounted = false; };
  }, []);

  const pickRandomFromPool = useCallback((exclude) => {
    if (!trackPool || trackPool.length === 0) return null;
    const excludeId = exclude?.id ?? exclude?.trackId ?? exclude?.filePath ?? exclude?.file_path ?? null;
    const candidates = trackPool.filter(t => {
      const tId = t?.id ?? t?.trackId ?? t?.filePath ?? t?.file_path ?? null;
      return excludeId == null || tId !== excludeId;
    });
    if (candidates.length === 0) return null;
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  }, [trackPool]);

  const logPlayback = useCallback(async (track) => {
    try {
      if (typeof window === 'undefined') return;
      const trackId = resolveTrackNumericId(track);
      if (trackId == null) return;

      let userId = null;
      try {
        const storedUser = window.localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.userId != null) userId = parsed.userId;
          else if (parsed?.id != null) userId = parsed.id;
        }
      } catch (err) {
        console.warn('Failed to parse stored user for playback history', err);
      }
      if (userId == null) {
        const fallback = window.localStorage.getItem('userId');
        if (fallback != null) userId = Number(fallback);
      }
      if (userId == null) return;

      const token = window.localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await apiClient.post(`/users/${userId}/play/${trackId}`, {}, { headers });
    } catch (error) {
      console.warn('Unable to record playback history', error);
    }
  }, []);

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
    
    logPlayback(track);
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [currentTrack, logPlayback]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => (prev === 'off' ? 'one' : 'off'));
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
      if (repeatMode === 'one') {
        audioEl.currentTime = 0;
        audioEl.play().catch((err) => {
          console.error('Error replaying on repeat-one:', err);
          setIsPlaying(false);
        });
        return;
      }
      const randomNext = pickRandomFromPool(currentTrack);
      if (randomNext) {
        setCurrentTrack(randomNext);
        setCurrentTime(0);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
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
  }, [volume, isPlaying, repeatMode, pickRandomFromPool, currentTrack]);

  const seekTo = useCallback((timeSec) => {
    const audioEl = audioRef.current;
    if (!audioEl || Number.isNaN(timeSec)) return;
    audioEl.currentTime = Math.max(0, Math.min(timeSec, duration || audioEl.duration || 0));
  }, [duration]);

  const changeVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolume(clamped);
    if (clamped > 0) setPreviousVolume(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const toggleMute = useCallback(() => {
    setVolume((current) => {
      const next = current > 0 ? 0 : (previousVolume > 0 ? previousVolume : 0.7);
      if (audioRef.current) audioRef.current.volume = next;
      return next;
    });
    setPreviousVolume((pv) => (volume > 0 ? volume : (pv > 0 ? pv : 0.7)));
  }, [previousVolume, volume]);

  const playPrevious = useCallback(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (audioEl.currentTime > 3) {
      audioEl.currentTime = 0;
      setCurrentTime(0);
    } else {
      audioEl.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      audioEl.pause();
    }
  }, []);

  const playNext = useCallback(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const randomNext = pickRandomFromPool(currentTrack);
    if (randomNext) {
      setCurrentTrack(randomNext);
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      audioEl.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      audioEl.pause();
    }
  }, [pickRandomFromPool, currentTrack]);

  const value = useMemo(() => ({
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    toggleShuffle,
    toggleRepeat,
    isShuffle,
    repeatMode,
    audioRef,
    audioSrc,
    currentTime,
    duration,
    seekTo,
    volume,
    changeVolume,
    toggleMute,
    playPrevious,
    playNext,
  }), [currentTrack, isPlaying, playTrack, togglePlayPause, toggleShuffle, toggleRepeat, isShuffle, repeatMode, audioSrc, currentTime, duration, seekTo, volume, changeVolume, toggleMute, playPrevious, playNext]);

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


