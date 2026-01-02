package com.musify.backend.controller;

import com.musify.backend.dto.PlaylistCreateMultipartDto;
import com.musify.backend.dto.PlaylistDetailResponseDto;
import com.musify.backend.dto.PlaylistDto;
import com.musify.backend.dto.PlaylistUpdateMultipartDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.service.IPlaylistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

    @PostMapping(value = "/users/{userId}/create-playlist", consumes = {"multipart/form-data"})
    public ResponseEntity<String> createPlaylist(
            @PathVariable Long userId,
            @Valid @ModelAttribute PlaylistCreateMultipartDto multipartDto) throws IOException {
        iPlaylistService.createPlaylistFromMultipart(userId, multipartDto);
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

    @PutMapping(value = "/users/{userId}/update-playlists/{playlistId}", consumes = {"multipart/form-data"})
    public ResponseEntity<PlaylistDto> updatePlaylist(
            @PathVariable Long userId,
            @PathVariable Long playlistId,
            @Valid @ModelAttribute PlaylistUpdateMultipartDto multipartDto) throws IOException {
        iPlaylistService.checkPlaylistOwner(userId, playlistId);
        PlaylistDto playlist = iPlaylistService.updatePlaylistFromMultipart(playlistId, multipartDto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(playlist);
    }
}
