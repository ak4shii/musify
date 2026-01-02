import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Player from '../components/Player';
import AlbumProfile from '../components/profiles/AlbumProfile';
import TrackAlbumShowProfile from '../components/showProfiles/albumPageProfile/TrackAlbumShowProfile';
import { useAuth } from '../contexts/AuthContext';
import apiClient, { getImageUrl } from '../helpers/apiClient';

const Album = () => {
  const { albumId } = useParams();
  const { isAuthenticated } = useAuth();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!albumId) return;

    const fetchAlbum = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = isAuthenticated
          ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
          : {};
        const { data } = await apiClient.get(`/albums/${albumId}`, { headers });
        const rawAlbumPayload = data?.album || data || null;
        const albumPayload = rawAlbumPayload ? {
          ...rawAlbumPayload,
          artist: rawAlbumPayload.primaryArtistName ?? (rawAlbumPayload.artistNames && rawAlbumPayload.artistNames.length > 0 ? rawAlbumPayload.artistNames[0] : null) ?? rawAlbumPayload.artist ?? rawAlbumPayload.artistName ?? null,
          artistName: rawAlbumPayload.primaryArtistName ?? (rawAlbumPayload.artistNames && rawAlbumPayload.artistNames.length > 0 ? rawAlbumPayload.artistNames[0] : null) ?? rawAlbumPayload.artistName ?? rawAlbumPayload.artist ?? null,
          primaryArtistName: rawAlbumPayload.primaryArtistName ?? null,
          primaryArtistId: rawAlbumPayload.primaryArtistId ?? null,
          artistNames: rawAlbumPayload.artistNames ?? null
        } : null;
        setAlbum(albumPayload);
        
        const rawTracks = data?.tracks || data?.songs || albumPayload?.tracks || [];
        const normalizedTracks = rawTracks.map(track => ({
          id: track.trackId ?? track.id,
          trackId: track.trackId ?? track.id,
          title: track.title ?? track.name,
          artist: track.primaryArtistName ?? (track.artistNames && track.artistNames.length > 0 ? track.artistNames[0] : null) ?? track.artist ?? track.artistName ?? albumPayload?.primaryArtistName ?? (albumPayload?.artistNames && albumPayload.artistNames.length > 0 ? albumPayload.artistNames[0] : null) ?? albumPayload?.artist ?? albumPayload?.artistName ?? null,
          artistName: track.primaryArtistName ?? (track.artistNames && track.artistNames.length > 0 ? track.artistNames[0] : null) ?? track.artistName ?? track.artist ?? null,
          primaryArtistName: track.primaryArtistName ?? null,
          primaryArtistId: track.primaryArtistId ?? null,
          artistNames: track.artistNames ?? null,
          artists: track.artistNames ?? null,
          album: track.album ?? track.albumTitle ?? albumPayload?.title ?? albumPayload?.name ?? null,
          duration: track.duration ?? track.durationText ?? (track.durationMs ? track.durationMs / 1000 : null),
          durationMs: track.durationMs,
          filePath: track.filePath ?? track.file_path ?? null,
          coverUrl: track.coverUrl ?? track.cover_url ?? track.imagePath ?? track.image_path ?? track.image ?? null
        }));
        setTracks(normalizedTracks);
        const rawRelated = data?.moreByArtist || data?.related || [];
        const normalizedRelated = rawRelated.map(al => ({
          ...al,
          id: al.albumId ?? al.id,
          albumId: al.albumId ?? al.id,
          artist: al.primaryArtistName ?? (al.artistNames && al.artistNames.length > 0 ? al.artistNames[0] : null) ?? al.artist ?? al.artistName ?? null,
          artistName: al.primaryArtistName ?? (al.artistNames && al.artistNames.length > 0 ? al.artistNames[0] : null) ?? al.artistName ?? al.artist ?? null,
          primaryArtistName: al.primaryArtistName ?? null,
          primaryArtistId: al.primaryArtistId ?? null,
          artistNames: al.artistNames ?? null,
          artists: al.artistNames ?? null
        }));
        setRelated(normalizedRelated);
      } catch (err) {
        setError('Unable to load album details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId, isAuthenticated]);

  const coverImage = useMemo(() => {
    const path =
      album?.coverUrl ||
      album?.cover_url ||
      album?.imagePath ||
      album?.image_path ||
      album?.image;
    return path ? getImageUrl(path) : null;
  }, [album]);


  const totalTracks = tracks?.length || album?.trackCount || album?.totalTracks;
  const releaseYear = album?.year || album?.releaseYear || album?.release_date?.slice(0, 4);

  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto custom-scrollbar'>
          <div className='px-6 py-6 space-y-10'>
            {loading ? (
              <div className='flex items-center justify-center h-64'>
                <div className='text-gray-400'>Loading album...</div>
              </div>
            ) : error ? (
              <div className='text-center py-12 text-red-400'>{error}</div>
            ) : !album ? (
              <div className='text-center py-12 text-gray-400'>Album not found.</div>
            ) : (
              <>
                <section className='flex flex-col md:flex-row gap-6 md:items-end'>
                  <div className='w-48 h-48 md:w-56 md:h-56 rounded bg-gradient-to-br from-[#282828] to-[#121212] overflow-hidden flex items-center justify-center'>
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={album?.title || album?.name || 'Album cover'}
                        className='w-full h-full object-cover'
                        crossOrigin='anonymous'
                      />
                    ) : (
                      <span className='text-4xl text-gray-400'>💿</span>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs uppercase tracking-[0.3em] text-gray-300 mb-2'>
                      {album?.type || 'Album'}
                    </p>
                    <h1 className='text-4xl md:text-6xl font-extrabold mb-4 truncate'>
                      {album?.title || album?.name || 'Unknown Album'}
                    </h1>
                    <div className='flex flex-wrap items-center gap-3 text-sm text-gray-300'>
                      {(() => {
                        const artistLabel = album?.primaryArtistName 
                          || (album?.artistNames && album.artistNames.length > 0 ? album.artistNames[0] : null)
                          || album?.artist 
                          || album?.artistName;
                        const artistId = album?.primaryArtistId;
                        
                        if (artistLabel) {
                          return artistId ? (
                            <Link 
                              to={`/artists/${artistId}`}
                              className='truncate max-w-full hover:text-white hover:underline underline-offset-1 transition-colors cursor-pointer'
                            >
                              {artistLabel}
                            </Link>
                          ) : (
                            <span className='truncate max-w-full'>{artistLabel}</span>
                          );
                        }
                        return null;
                      })()}
                      {releaseYear ? <span className='flex-shrink-0'>• {releaseYear}</span> : null}
                      {totalTracks ? <span className='flex-shrink-0'>• {totalTracks} tracks</span> : null}
                    </div>
                  </div>
                </section>

                {tracks?.length ? (
                  <section>
                    <h2 className='text-2xl font-bold mb-5'>Tracklist</h2>
                    <div className='divide-y divide-white/5 rounded-lg bg-white/5'>
                      {tracks.map((track, index) => (
                        <TrackAlbumShowProfile key={track?.id || track?.trackId || track?.title || index} track={track} index={index} album={album} />
                      ))}
                    </div>
                  </section>
                ) : null}

                {related?.length ? (
                  <section className='space-y-4'>
                    <h2 className='text-2xl font-bold'>More by this artist</h2>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      {related.map((record, index) => (
                        <AlbumProfile key={record?.id || record?.albumId || index} album={record} index={index} />
                      ))}
                    </div>
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

export default Album;



