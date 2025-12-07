package com.musify.backend.controller;

import com.musify.backend.dto.PlaylistCreateRequestDto;
import com.musify.backend.dto.PlaylistDetailResponseDto;
import com.musify.backend.dto.PlaylistDto;
import com.musify.backend.dto.PlaylistUpdateRequestDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.service.IPlaylistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class PlaylistController {

    private final IPlaylistService iPlaylistService;

    @GetMapping("/users/{userId}/playlists")
    public ResponseEntity<List<PlaylistDto>> getPlaylistsByUser(@PathVariable Long userId) {
        List<PlaylistDto> playlists = iPlaylistService.getPlaylistsByUser(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(playlists);
    }

    @GetMapping("/playlists/{playlistId}/tracks")
    public ResponseEntity<PlaylistDetailResponseDto> getTracksInPlaylist(@PathVariable Long playlistId) {
        PlaylistDto playlist = iPlaylistService.getPlaylistById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id" + playlistId));
        List<TrackDto> tracks = iPlaylistService.getTracksInPlaylist(playlistId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(new PlaylistDetailResponseDto(playlist, tracks));
    }

    @PostMapping("/users/{userId}/create-playlist")
    public ResponseEntity<String> createPlaylist(@PathVariable Long userId, @RequestBody PlaylistCreateRequestDto request) {
        iPlaylistService.createPlaylist(
                userId,
                request.getPlaylistName(),
                request.getIsPublic(),
                request.getCoverUrl()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Playlist created successfully");
    }

    @PostMapping("users/{userId}/playlists/{playlistId}/add-track/{trackId}")
    public ResponseEntity<String> addTrackToPlaylist(@PathVariable Long userId, @PathVariable Long playlistId, @PathVariable Long trackId) {
        iPlaylistService.checkPlaylistOwner(userId, playlistId);
        iPlaylistService.addTrackToPlaylist(playlistId, trackId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Track added successfully");
    }

    @DeleteMapping("users/{userId}/playlists/{playlistId}/remove-track/{trackId}")
    public ResponseEntity<String> removeTrackFromPlaylist(@PathVariable Long userId, @PathVariable Long playlistId, @PathVariable Long trackId) {
        iPlaylistService.checkPlaylistOwner(userId, playlistId);
        iPlaylistService.removeTrackFromPlaylist(playlistId, trackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body("Track removed successfully");
    }

    @DeleteMapping("/users/{userId}/delete-playlists/{playlistId}")
    public ResponseEntity<String> deletePlaylist(@PathVariable Long userId, @PathVariable Long playlistId) {
        iPlaylistService.checkPlaylistOwner(userId, playlistId);
        iPlaylistService.deletePlaylist(playlistId);
        return ResponseEntity.status(HttpStatus.OK)
                .body("Playlist deleted successfully");
    }

    @PutMapping("/users/{userId}/update-playlists/{playlistId}")
    public ResponseEntity<PlaylistDto> updatePlaylist(
            @PathVariable Long userId,
            @PathVariable Long playlistId,
            @Valid @RequestBody PlaylistUpdateRequestDto request) {
        iPlaylistService.checkPlaylistOwner(userId, playlistId);
        PlaylistDto playlist = iPlaylistService.updatePlaylist(playlistId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(playlist);
    }
}
