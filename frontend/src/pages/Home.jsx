import React, { useEffect, useState } from "react";
import apiClient from "../helpers/apiClient";

import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import Header from '../components/Header';
import Display from '../components/Display';

const Home = () => {

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
        
        const response = await apiClient.get('/');
        
        if (response.data) {
          setSongs(response.data.tracks || []);
          setArtists(response.data.artists || []);
          setAlbums(response.data.albums || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        console.error('Error details:', err.response?.data || err.message);
        console.error('Error status:', err.response?.status);
        setError(`Failed to load data: ${err.response?.status ? `HTTP ${err.response.status}` : err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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