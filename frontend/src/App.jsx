import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRelationsProvider } from "./contexts/UserRelationsContext";
import { PlaylistModalProvider } from "./contexts/PlaylistModalContext";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Artist from "./pages/Artist";
import Album from "./pages/Album";
import LikedSongs from "./pages/LikedSongs";
import FollowedArtists from "./pages/FollowedArtists";
import Playlist from "./pages/Playlist";
import PlaylistDetail from "./pages/PlaylistDetail";
import AdminPanel from "./pages/AdminPanel";
import CustomerRoute from "./components/CustomerRoute";

function App() {
  return (
    <AuthProvider>
      <UserRelationsProvider>
        <PlaylistModalProvider>
          <Routes>
          <Route path="/" element={<CustomerRoute><Home /></CustomerRoute>} />
          <Route path="/search" element={<CustomerRoute><Search /></CustomerRoute>} />
          <Route path="/support" element={<CustomerRoute><Support /></CustomerRoute>} />
          <Route path="/liked" element={<CustomerRoute><LikedSongs /></CustomerRoute>} />
          <Route path="/followed-artists" element={<CustomerRoute><FollowedArtists /></CustomerRoute>} />
          <Route path="/playlists" element={<CustomerRoute><Playlist /></CustomerRoute>} />
          <Route path="/playlists/:playlistId" element={<CustomerRoute><PlaylistDetail /></CustomerRoute>} />
          <Route path="/artists/followed-artists" element={<Navigate to="/followed-artists" replace />} />
          <Route path="/artists/:artistId" element={<CustomerRoute><Artist /></CustomerRoute>} />
          <Route path="/albums/:albumId" element={<CustomerRoute><Album /></CustomerRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          </Routes>
        </PlaylistModalProvider>
      </UserRelationsProvider>
    </AuthProvider>
  );
}

export default App;

