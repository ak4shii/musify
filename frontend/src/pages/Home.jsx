import React, { useEffect, useState } from "react";
import apiClient from "../helpers/apiClient";
import { useAuth } from "../contexts/AuthContext";

import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import Header from '../components/Header';
import Display from '../components/Display';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get('/', {
          headers: isAuthenticated ? {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          } : {}
        });
        
        if (response.data) {
          setSongs(response.data.tracks || []);
          setArtists(response.data.artists || []);
          const rawAlbums = response.data.albums || [];
          const normalizedAlbums = rawAlbums.map(al => ({
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
          setAlbums(normalizedAlbums);
        }
      } catch (err) {
        setError(`Failed to load data: ${err.response?.status ? `HTTP ${err.response.status}` : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <Display 
          songs={songs}
          artists={artists}
          albums={albums}
          loading={loading}
          error={error}
        />
      </div>
      <Player />
    </div>
  )
}

export default Home