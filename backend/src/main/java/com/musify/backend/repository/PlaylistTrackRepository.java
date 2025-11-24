package com.musify.backend.repository;

import com.musify.backend.entity.PlaylistTrack;
import com.musify.backend.entity.PlaylistTrackId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistTrackRepository extends JpaRepository<PlaylistTrack, PlaylistTrackId> {

    List<PlaylistTrack> findByPlaylist_PlaylistId(Integer playlistId);
}
