import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRelationsProvider } from "./contexts/UserRelationsContext";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Artist from "./pages/Artist";
import Album from "./pages/Album";
import LikedSongs from "./pages/LikedSongs";
import FollowedArtists from "./pages/FollowedArtists";

function App() {
  return (
    <AuthProvider>
      <UserRelationsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/support" element={<Support />} />
          <Route path="/artists/:artistId" element={<Artist />} />
          <Route path="/albums/:albumId" element={<Album />} />
          <Route path="/liked" element={<LikedSongs />} />
          <Route path="/followed-artists" element={<FollowedArtists />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserRelationsProvider>
    </AuthProvider>
  );
}

export default App;

