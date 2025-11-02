import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import apiClient, { getImageUrl } from '../helpers/apiClient'
import { useAuth } from '../contexts/AuthContext'

import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import Header from '../components/Header';
import TrackSearchProfile from '../components/searchProfiles/TrackSearchProfile';
import ArtistProfile from '../components/profiles/ArtistProfile';
import AlbumProfile from '../components/profiles/AlbumProfile';
import PlaylistSearchProfile from '../components/searchProfiles/PlaylistSearchProfile';
import ScrollableRow from '../components/profiles/ScrollableRow';
 

const Search = () => {
  const { user, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  })
  const [loading, setLoading] = useState(false)
 

  useEffect(() => {
    const query = searchParams.get('q')
    if (query && query.trim()) {
      setSearchQuery(query.trim())
      performSearch(query.trim())
    } else {
      setSearchQuery('')
      setSearchResults({ tracks: [], artists: [], albums: [], playlists: [] })
      setLoading(false)
    }
  }, [searchParams])

  const performSearch = async (query) => {
    setLoading(true)
    try {
      const { data } = await apiClient.post('/search', null, { 
        params: { q: query },
        headers: isAuthenticated ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      })

      const normalizeTracks = (tracks) => (tracks || []).map(t => ({
        id: t.trackId ?? t.id,
        trackId: t.trackId ?? t.id,
        title: t.title ?? t.name,
        artist: t.artist ?? t.artistName ?? null,
        artistName: t.artistName ?? t.artist ?? null,
        album: t.album ?? t.albumTitle ?? null,
        albumTitle: t.albumTitle ?? t.album ?? null,
        duration: t.duration ?? t.durationText ?? null,
        genre: t.genre ?? null,
        popularity: t.popularity ?? null,
        filePath: t.filePath ?? t.file_path ?? null,
        coverUrl: t.coverUrl ?? t.cover_url ?? t.imagePath ?? t.image_path ?? t.image ?? null,
        image: getImageUrl(t.coverUrl ?? t.cover_url ?? t.imagePath ?? t.image_path ?? t.image)
      }))

      const normalizeArtists = (artists) => (artists || []).map(a => ({
        id: a.artistId ?? a.id,
        artistId: a.artistId ?? a.id,
        name: a.name ?? a.artistName,
        artistName: a.name ?? a.artistName,
        profileUrl: a.profileUrl ?? a.profile_url ?? a.imagePath ?? a.image_path ?? a.image ?? null,
        profile_url: a.profile_url ?? a.profileUrl ?? null,
        imagePath: a.imagePath ?? a.image_path ?? a.image ?? null,
        image_path: a.image_path ?? a.imagePath ?? null,
        image: a.image ?? null,
        followers: a.followers ?? a.followersCount ?? null
      }))

      const normalizeAlbums = (albums) => (albums || []).map(al => ({
        id: al.albumId ?? al.id,
        albumId: al.albumId ?? al.id,
        title: al.title ?? al.name,
        artist: al.artist ?? al.artistName ?? null,
        artistName: al.artistName ?? al.artist ?? null,
        year: al.year ?? al.releaseYear ?? null,
        coverUrl: al.coverUrl ?? al.cover_url ?? al.imagePath ?? al.image_path ?? al.image ?? null,
        cover_url: al.cover_url ?? al.coverUrl ?? null,
        imagePath: al.imagePath ?? al.image_path ?? al.image ?? null,
        image_path: al.image_path ?? al.imagePath ?? null,
        image: al.image ?? null
      }))

      const results = {
        tracks: normalizeTracks(data.tracks ?? []),
        artists: normalizeArtists(data.artists ?? []),
        albums: normalizeAlbums(data.albums ?? []),
        playlists: Array.isArray(data.playlists) ? data.playlists : []
      }

      setSearchResults(results)
    } catch (err) {
      console.error('Search failed', err)
      setSearchResults({ tracks: [], artists: [], albums: [], playlists: [] })
    } finally {
      setLoading(false)
    }
  }

  const SearchSection = ({ title, items, type }) => {
    if (items.length === 0) return null

    if (type === 'artist') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 px-6">{title}</h2>
          <ScrollableRow id={`row-search-artists`} title="" showTitle={false}>
            {items.map((artist, i) => (
              <ArtistProfile key={artist.id || i} artist={artist} index={i} />
            ))}
          </ScrollableRow>
        </div>
      )
    }

    if (type === 'album') {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 px-6">{title}</h2>
          <ScrollableRow id={`row-search-albums`} title="" showTitle={false}>
            {items.map((album, i) => (
              <AlbumProfile key={album.id || i} album={album} index={i} />
            ))}
          </ScrollableRow>
        </div>
      )
    }

    const renderCard = (item) => {
      switch (type) {
        case 'track':
          return <TrackSearchProfile key={item.id} track={item} />
        case 'playlist':
          return <PlaylistSearchProfile key={item.id} playlist={item} />
        default:
          return null
      }
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className={`grid ${type === 'track' ? 'gap-1' : 'gap-2'} ${type === 'album' || type === 'playlist' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
          {items.map(item => renderCard(item))}
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto'>
          <div className='px-6 py-4'>
            {searchQuery ? (
              <>
                <h1 className='text-2xl font-bold text-white mb-6'>
                  Search results for "{searchQuery}"
                </h1>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400">Searching...</div>
                  </div>
                ) : (
                  <>
                    <SearchSection title="Songs" items={searchResults.tracks} type="track" />
                    <SearchSection title="Artists" items={searchResults.artists} type="artist" />
                    <SearchSection title="Albums" items={searchResults.albums} type="album" />
                    <SearchSection title="Playlists" items={searchResults.playlists} type="playlist" />
                    
                    {searchResults.tracks.length === 0 && 
                     searchResults.artists.length === 0 && 
                     searchResults.albums.length === 0 && 
                     searchResults.playlists.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
                        <p className="text-gray-500 text-sm mt-2">Try searching for something else</p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-white mb-4">Search for music</h1>
                <p className="text-gray-400">Find your favorite songs, artists, albums, and playlists</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Player />
    </div>
  )
}

export default Search