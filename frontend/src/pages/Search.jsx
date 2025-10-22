import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import apiClient from '../helpers/apiClient'

import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import Header from '../components/Header';
import TrackProfile from '../components/profiles/TrackProfile';
import ArtistProfile from '../components/profiles/ArtistProfile';
import AlbumProfile from '../components/profiles/AlbumProfile';
import PlaylistProfile from '../components/profiles/PlaylistProfile';

const Search = () => {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`)
      
      if (response.data) {
        setSearchResults({
          tracks: response.data.tracks || [],
          artists: response.data.artists || [],
          albums: response.data.albums || [],
          playlists: response.data.playlists || []
        })
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(`Search failed: ${err.response?.status ? `HTTP ${err.response.status}` : err.message}`)
      setSearchResults({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      })
    } finally {
      setLoading(false)
    }
  }

  const SearchSection = ({ title, items, type }) => {
    if (items.length === 0) return null

    const renderItem = (item, index) => {
      const mappedItem = {
        ...item,
        title: item.title || item.name || item.trackName,
        artist: item.artist || item.artistName || item.performer,
        album: item.album || item.albumName,
        coverUrl: item.coverUrl || item.imageUrl || item.thumbnail,
        profileUrl: item.profileUrl || item.imageUrl || item.avatar,
        artistName: item.artistName || item.name,
        releaseDate: item.releaseDate || item.year,
        genre: item.genre || item.category
      }

      switch (type) {
        case 'track':
          return <TrackProfile key={item.id || index} track={mappedItem} index={index} />
        case 'artist':
          return <ArtistProfile key={item.id || index} artist={mappedItem} index={index} />
        case 'album':
          return <AlbumProfile key={item.id || index} album={mappedItem} index={index} />
        case 'playlist':
          return <PlaylistProfile key={item.id || index} playlist={mappedItem} index={index} />
        default:
          return null
      }
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className={`grid gap-2 ${type === 'artist' || type === 'album' || type === 'playlist' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
          {items.map(renderItem)}
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
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <div className="text-gray-400">Searching...</div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-400 text-lg mb-2">Error: {error}</p>
                    <p className="text-gray-500 text-sm">Please try again or check your connection</p>
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
                     searchResults.playlists.length === 0 && !loading && (
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