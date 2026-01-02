package com.musify.backend.repository;

import com.musify.backend.entity.Playlist;
import com.musify.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findPlaylistsByUser(User user);

    @Query("SELECT p FROM Playlist p WHERE p.user.userId = :userId")
    List<Playlist> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT p FROM Playlist p WHERE p.isPublic = true AND LOWER(p.playlistName) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Playlist> searchPublicPlaylists(@Param("q") String query);
}
