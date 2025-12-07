package com.musify.backend.service;

import com.musify.backend.dto.PlaylistDto;
import com.musify.backend.dto.PlaylistUpdateRequestDto;
import com.musify.backend.dto.TrackDto;

import java.util.List;
import java.util.Optional;

public interface IPlaylistService {

    void createPlaylist(Long userId, String playlistName, Boolean isPublic, String coverUrl);

    Optional<PlaylistDto> getPlaylistById(Long playlistId);

    List<PlaylistDto> getPlaylistsByUser(Long userId);

    PlaylistDto updatePlaylist(Long playlistId, PlaylistUpdateRequestDto request);

    void deletePlaylist(Long playlistId);

    void addTrackToPlaylist(Long playlistId, Long trackId);

    void removeTrackFromPlaylist(Long playlistId, Long trackId);

    List<TrackDto> getTracksInPlaylist(Long playlistId);

    void checkPlaylistOwner(Long userId, Long playlistId);
}
