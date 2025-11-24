package com.musify.backend.repository;

import com.musify.backend.entity.Playlist;
import com.musify.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findPlaylistsByUser(User user);
}
