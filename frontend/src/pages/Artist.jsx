import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Player from '../components/Player';
import AlbumProfile from '../components/profiles/AlbumProfile';
import ScrollableRow from '../components/ScrollableRow';
import TrackArtistShowProfile from '../components/showProfiles/artistPageProfile/TrackArtistShowProfile';
import { useAuth } from '../contexts/AuthContext';
import apiClient, { getImageUrl } from '../helpers/apiClient';
import { useUserRelations } from '../contexts/UserRelationsContext';
import toast from 'react-hot-toast';

const formatNumber = (value) => {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(
      Number(value),
    );
  } catch {
    return value;
  }
};

const Artist = () => {
  const { artistId } = useParams();
  const { isAuthenticated } = useAuth();
  const { isArtistFollowed, followArtist, unfollowArtist } = useUserRelations();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [discography, setDiscography] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followPending, setFollowPending] = useState(false);

  useEffect(() => {
    if (!artistId) return;

    const numericId = Number(artistId);
    if (isNaN(numericId) || numericId <= 0) {
      setError('Invalid artist ID');
      setLoading(false);
      return;
    }

    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = isAuthenticated
          ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
          : {};
        const { data } = await apiClient.get(`/artists/${artistId}`, { headers });
        const artistPayload = data?.artist || data || null;
        setArtist(artistPayload);
        
        const rawTracks = data?.topTracks || data?.tracks || artistPayload?.tracks || [];
        const normalizedTracks = rawTracks.map(track => ({
          id: track.trackId ?? track.id,
          trackId: track.trackId ?? track.id,
          title: track.title ?? track.name,
          artist: track.artist ?? track.artistName ?? artistPayload?.name ?? artistPayload?.artistName ?? null,
          album: track.album ?? track.albumTitle ?? null,
          duration: track.duration ?? track.durationText ?? null,
          filePath: track.filePath ?? track.file_path ?? null,
          coverUrl: track.coverUrl ?? track.cover_url ?? track.imagePath ?? track.image_path ?? track.image ?? null,
          image: getImageUrl(track.coverUrl ?? track.cover_url ?? track.imagePath ?? track.image_path ?? track.image)
        }));
        setTopTracks(normalizedTracks);
        setDiscography(data?.albums || data?.discography || []);
      } catch (err) {
        console.error('Failed to load artist', err);
        setError('Unable to load artist details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId, isAuthenticated]);

  const resolvedArtistId = useMemo(() => {
    if (artist?.artistId != null) return artist.artistId;
    if (artist?.id != null) return artist.id;
    return artistId ? Number(artistId) : null;
  }, [artist, artistId]);

  const isFollowing = resolvedArtistId != null && isArtistFollowed(resolvedArtistId);

  const heroImage = useMemo(() => {
    const path =
      artist?.profileUrl ||
      artist?.profile_url ||
      artist?.imagePath ||
      artist?.image_path ||
      artist?.image;
    return path ? getImageUrl(path) : null;
  }, [artist]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to follow artists');
      return;
    }
    if (!resolvedArtistId || !artist) return;
    setFollowPending(true);
    try {
      if (isFollowing) {
        await unfollowArtist(resolvedArtistId);
        toast.success('Artist removed from follows');
      } else {
        await followArtist({ ...artist, artistId: resolvedArtistId });
        toast.success('Artist added to follows');
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      toast.error('Unable to follow status');
    } finally {
      setFollowPending(false);
    }
  };


  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='px-6 py-6 space-y-10'>
            {loading ? (
              <div className='flex items-center justify-center h-64'>
                <div className='text-gray-400'>Loading artist...</div>
              </div>
            ) : error ? (
              <div className='text-center py-12 text-red-400'>{error}</div>
            ) : !artist ? (
              <div className='text-center py-12 text-gray-400'>Artist not found.</div>
            ) : (
              <>
                <section className='flex flex-col md:flex-row md:items-end gap-6'>
                  <div className='w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-[#282828] to-[#121212] overflow-hidden flex items-center justify-center'>
                    {heroImage ? (
                      <img
                        src={heroImage}
                        alt={artist?.artistName || artist?.name || 'Artist cover'}
                        className='w-full h-full object-cover'
                        crossOrigin='anonymous'
                      />
                    ) : (
                      <span className='text-4xl text-gray-400'>👤</span>
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs uppercase tracking-[0.3em] text-gray-300 mb-2'>Artist</p>
                    <h1 className='text-4xl md:text-6xl font-extrabold mb-4'>
                      {artist?.artistName || artist?.name || 'Unknown Artist'}
                    </h1>
                    <div className='flex flex-wrap items-center gap-4 text-sm text-gray-300'>
                      {artist?.genres?.length ? (
                        <span>{artist.genres.join(' • ')}</span>
                      ) : null}
                      {artist?.followers ? (
                        <span>{formatNumber(artist.followers)} followers</span>
                      ) : null}
                      {artist?.monthlyListeners ? (
                        <span>{formatNumber(artist.monthlyListeners)} monthly listeners</span>
                      ) : null}
                    </div>
                    <div className='mt-5 flex items-center gap-3'>
                      <button
                        onClick={handleFollowToggle}
                        disabled={followPending || !artist}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                          isFollowing
                            ? 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
                            : 'bg-white text-black hover:bg-gray-200'
                        } disabled:opacity-60`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                </section>

                {topTracks?.length ? (
                  <section>
                    <h2 className='text-2xl font-bold mb-5'>Popular</h2>
                    <div className='space-y-1'>
                      {topTracks.map((track) => (
                        <TrackArtistShowProfile key={track?.id || track?.trackId || track?.title} track={track} />
                      ))}
                    </div>
                  </section>
                ) : null}

                {discography?.length ? (
                  <section className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-2xl font-bold'>Discography</h2>
                    </div>
                    <ScrollableRow id='artist-discography' title='' showTitle={false}>
                      {discography.map((album, i) => (
                        <AlbumProfile key={album?.id || album?.albumId || i} album={album} index={i} />
                      ))}
                    </ScrollableRow>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
      <Player />
    </div>
  );
};

export default Artist;



