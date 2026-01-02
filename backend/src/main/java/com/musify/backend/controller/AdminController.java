package com.musify.backend.controller;

import com.musify.backend.dto.*;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.service.IAlbumService;
import com.musify.backend.service.IArtistService;
import com.musify.backend.service.ITrackService;
import com.musify.backend.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final IArtistService iArtistService;
    private final IAlbumService iAlbumService;
    private final ITrackService iTrackService;
    private final IUserService iUserService;

    @GetMapping("/artists")
    public ResponseEntity<List<ArtistDto>> getAllArtists() {
        List<ArtistDto> artists = iArtistService.getAllArtists();
        return ResponseEntity.ok(artists);
    }

    @GetMapping("/artists/{artistId}")
    public ResponseEntity<ArtistDto> getArtistById(@PathVariable Integer artistId) {
        ArtistDto artist = iArtistService.getArtistById(artistId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));
        return ResponseEntity.ok(artist);
    }

    @PostMapping(value = "/artists", consumes = {"multipart/form-data"})
    public ResponseEntity<ArtistDto> createArtist(
            @Valid @ModelAttribute ArtistCreateMultipartDto multipartDto) throws IOException {
        ArtistDto createdArtist = iArtistService.createArtistFromMultipart(multipartDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArtist);
    }

    @PutMapping(value = "/artists/{artistId}", consumes = {"multipart/form-data"})
    public ResponseEntity<ArtistDto> updateArtist(
            @PathVariable Integer artistId,
            @Valid @ModelAttribute ArtistUpdateMultipartDto multipartDto) throws IOException {
        ArtistDto updatedArtist = iArtistService.updateArtistFromMultipart(artistId, multipartDto);
        return ResponseEntity.ok(updatedArtist);
    }

    @DeleteMapping("/artists/{artistId}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Integer artistId) {
        iArtistService.deleteArtist(artistId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/albums")
    public ResponseEntity<List<AlbumDto>> getAllAlbums() {
        List<AlbumDto> albums = iAlbumService.getAllAlbums();
        return ResponseEntity.ok(albums);
    }

    @GetMapping("/albums/{albumId}")
    public ResponseEntity<AlbumDto> getAlbumById(@PathVariable Integer albumId) {
        AlbumDto album = iAlbumService.getAlbumById(albumId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + albumId));
        return ResponseEntity.ok(album);
    }

    @PostMapping(value = "/albums", consumes = {"multipart/form-data"})
    public ResponseEntity<AlbumDto> createAlbum(
            @Valid @ModelAttribute AlbumCreateMultipartDto multipartDto) throws IOException {
        AlbumDto createdAlbum = iAlbumService.createAlbumFromMultipart(multipartDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAlbum);
    }

    @PutMapping(value = "/albums/{albumId}", consumes = {"multipart/form-data"})
    public ResponseEntity<AlbumDto> updateAlbum(
            @PathVariable Integer albumId,
            @Valid @ModelAttribute AlbumUpdateMultipartDto multipartDto) throws IOException {
        AlbumDto updatedAlbum = iAlbumService.updateAlbumFromMultipart(albumId, multipartDto);
        return ResponseEntity.ok(updatedAlbum);
    }

    @DeleteMapping("/albums/{albumId}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Integer albumId) {
        iAlbumService.deleteAlbum(albumId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tracks")
    public ResponseEntity<List<TrackDto>> getAllTracks() {
        List<TrackDto> tracks = iTrackService.getAllTracks();
        return ResponseEntity.ok(tracks);
    }

    @GetMapping("/tracks/{trackId}")
    public ResponseEntity<TrackDto> getTrackById(@PathVariable Integer trackId) {
        TrackDto track = iTrackService.getTrackById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + trackId));
        return ResponseEntity.ok(track);
    }

    @PostMapping(value = "/tracks", consumes = {"multipart/form-data"})
    public ResponseEntity<TrackDto> createTrack(
            @Valid @ModelAttribute TrackCreateMultipartDto multipartDto) throws IOException {
        TrackDto createdTrack = iTrackService.createTrackFromMultipart(multipartDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrack);
    }

    @PutMapping("/tracks/{trackId}")
    public ResponseEntity<TrackDto> updateTrack(
            @PathVariable Integer trackId,
            @Valid @RequestBody TrackUpdateRequestDto request) {
        TrackDto updatedTrack = iTrackService.updateTrack(trackId, request);
        return ResponseEntity.ok(updatedTrack);
    }

    @DeleteMapping("/tracks/{trackId}")
    public ResponseEntity<Void> deleteTrack(@PathVariable Integer trackId) {
        iTrackService.deleteTrack(trackId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = iUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer userId) {
        UserDto user = iUserService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/enable")
    public ResponseEntity<UserDto> updateUserEnabledStatus(
            @PathVariable Integer userId,
            @Valid @RequestBody UserEnableRequestDto request) {
        UserDto updatedUser = iUserService.updateUserEnabledStatus(userId, request);
        return ResponseEntity.ok(updatedUser);
    }
}
