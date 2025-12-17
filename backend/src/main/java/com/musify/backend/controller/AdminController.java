package com.musify.backend.controller;

import com.musify.backend.dto.*;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.Artist;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.AlbumArtistRepository;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.storage.FileStorageService;
import com.musify.backend.service.IAlbumService;
import com.musify.backend.service.IArtistService;
import com.musify.backend.service.ITrackService;
import com.musify.backend.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final IArtistService artistService;
    private final IAlbumService albumService;
    private final ITrackService trackService;
    private final IUserService userService;
    private final FileStorageService fileStorageService;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    private final AlbumArtistRepository albumArtistRepository;

    @GetMapping("/artists")
    public ResponseEntity<List<ArtistDto>> getAllArtists() {
        List<ArtistDto> artists = artistService.getAllArtists();
        return ResponseEntity.ok(artists);
    }

    @GetMapping("/artists/{artistId}")
    public ResponseEntity<ArtistDto> getArtistById(@PathVariable Integer artistId) {
        ArtistDto artist = artistService.getArtistById(artistId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));
        return ResponseEntity.ok(artist);
    }

    @PostMapping(value = "/artists", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createArtist(
            @RequestParam("artistName") String artistName,
            @RequestParam("biography") String biography,
            @RequestParam("profileImage") MultipartFile profileImage) {
        try {
            if (profileImage == null || profileImage.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Profile image is required");
            }

            String profileUrl = fileStorageService.uploadArtistProfileImage(profileImage, artistName);

            ArtistCreateRequestDto request = new ArtistCreateRequestDto();
            request.setArtistName(artistName);
            request.setBiography(biography);
            request.setProfileUrl(profileUrl);

            ArtistDto createdArtist = artistService.createArtist(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdArtist);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    @PutMapping(value = "/artists/{artistId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateArtist(
            @PathVariable Integer artistId,
            @RequestParam(value = "artistName", required = false) String artistName,
            @RequestParam(value = "biography", required = false) String biography,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            ArtistUpdateRequestDto request = new ArtistUpdateRequestDto();
            
            if (artistName != null) {
                request.setArtistName(artistName);
            }
            if (biography != null) {
                request.setBiography(biography);
            }
            
            if (profileImage != null && !profileImage.isEmpty()) {
                ArtistDto existingArtist = artistService.getArtistById(artistId.longValue())
                        .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));
                
                String profileUrl = fileStorageService.uploadArtistProfileImage(profileImage, existingArtist.getArtistName());
                request.setProfileUrl(profileUrl);
            }
            
            ArtistDto updatedArtist = artistService.updateArtist(artistId, request);
            return ResponseEntity.ok(updatedArtist);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating artist: " + e.getMessage());
        }
    }

    @DeleteMapping("/artists/{artistId}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Integer artistId) {
        artistService.deleteArtist(artistId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/albums")
    public ResponseEntity<List<AlbumDto>> getAllAlbums() {
        List<AlbumDto> albums = albumService.getAllAlbums();
        return ResponseEntity.ok(albums);
    }

    @GetMapping("/albums/{albumId}")
    public ResponseEntity<AlbumDto> getAlbumById(@PathVariable Integer albumId) {
        AlbumDto album = albumService.getAlbumById(albumId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + albumId));
        return ResponseEntity.ok(album);
    }

    @PostMapping(value = "/albums", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createAlbum(
            @RequestParam("title") String title,
            @RequestParam("releaseDate") String releaseDate,
            @RequestParam("coverImage") MultipartFile coverImage,
            @RequestParam("artistIds") List<Integer> artistIds) {
        try {
            if (coverImage == null || coverImage.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Cover image is required");
            }

            if (artistIds == null || artistIds.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: At least one artist ID is required");
            }

            Artist firstArtist = artistRepository.findById(artistIds.getFirst().longValue())
                    .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistIds.getFirst()));

            String coverUrl = fileStorageService.uploadAlbumCoverImage(coverImage, firstArtist.getArtistName(), title);

            AlbumCreateRequestDto request = new AlbumCreateRequestDto();
            request.setTitle(title);
            request.setReleaseDate(java.time.LocalDate.parse(releaseDate));
            request.setCoverUrl(coverUrl);
            request.setArtistIds(artistIds);

            AlbumDto createdAlbum = albumService.createAlbum(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAlbum);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    @PutMapping(value = "/albums/{albumId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateAlbum(
            @PathVariable Integer albumId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "releaseDate", required = false) String releaseDate,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
        try {
            AlbumUpdateRequestDto request = new AlbumUpdateRequestDto();
            
            if (title != null) {
                request.setTitle(title);
            }
            if (releaseDate != null) {
                request.setReleaseDate(java.time.LocalDate.parse(releaseDate));
            }
            
            if (coverImage != null && !coverImage.isEmpty()) {
                Album existingAlbum = albumRepository.findById(albumId.longValue())
                        .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + albumId));
                
                java.util.List<com.musify.backend.entity.AlbumArtist> allAlbumArtists = albumArtistRepository.findAll();
                java.util.Optional<com.musify.backend.entity.AlbumArtist> albumArtistOpt = allAlbumArtists.stream()
                        .filter(aa -> aa.getId().getAlbumId().equals(albumId))
                        .findFirst();
                
                if (albumArtistOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Error: Album must have at least one artist");
                }
                
                Artist firstArtist = albumArtistOpt.get().getArtist();
                String albumTitle = title != null ? title : existingAlbum.getTitle();
                String coverUrl = fileStorageService.uploadAlbumCoverImage(coverImage, firstArtist.getArtistName(), albumTitle);
                request.setCoverUrl(coverUrl);
            }
            
            AlbumDto updatedAlbum = albumService.updateAlbum(albumId, request);
            return ResponseEntity.ok(updatedAlbum);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating album: " + e.getMessage());
        }
    }

    @DeleteMapping("/albums/{albumId}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Integer albumId) {
        albumService.deleteAlbum(albumId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tracks")
    public ResponseEntity<List<TrackDto>> getAllTracks() {
        List<TrackDto> tracks = trackService.getAllTracks();
        return ResponseEntity.ok(tracks);
    }

    @GetMapping("/tracks/{trackId}")
    public ResponseEntity<TrackDto> getTrackById(@PathVariable Integer trackId) {
        TrackDto track = trackService.getTrackById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + trackId));
        return ResponseEntity.ok(track);
    }

    @PostMapping(value = "/tracks", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createTrack(
            @RequestParam("albumId") Integer albumId,
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @RequestParam("genre") String genre,
            @RequestParam("artistIds") List<Integer> artistIds) {
        try {
            Album album = albumRepository.findById(albumId.longValue())
                    .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + albumId));
            
            if (artistIds == null || artistIds.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: At least one artist ID is required");
            }
            
            Artist firstArtist = artistRepository.findById(artistIds.getFirst().longValue())
                    .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistIds.getFirst()));

            String filePath = fileStorageService.uploadMp3FileToAlbum(file, firstArtist.getArtistName(), album.getTitle());
            
            String duration;
            try {
                java.nio.file.Path staticPath = java.nio.file.Paths.get("src/main/resources/static");
                java.nio.file.Path fullFilePath = staticPath.resolve(filePath.substring(1)); // Remove leading /
                duration = fileStorageService.extractMp3Duration(fullFilePath);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Failed to extract duration from MP3 file - " + e.getMessage());
            }

            String coverUrl = album.getCoverUrl();

            TrackCreateRequestDto request = new TrackCreateRequestDto();
            request.setAlbumId(albumId);
            request.setTitle(title);
            request.setFilePath(filePath);
            request.setCoverUrl(coverUrl);
            request.setGenre(genre);
            request.setDuration(duration);
            request.setArtistIds(artistIds);
            
            TrackDto createdTrack = trackService.createTrack(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTrack);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    @PutMapping("/tracks/{trackId}")
    public ResponseEntity<TrackDto> updateTrack(
            @PathVariable Integer trackId,
            @Valid @RequestBody TrackUpdateRequestDto request) {
        TrackDto updatedTrack = trackService.updateTrack(trackId, request);
        return ResponseEntity.ok(updatedTrack);
    }

    @DeleteMapping("/tracks/{trackId}")
    public ResponseEntity<Void> deleteTrack(@PathVariable Integer trackId) {
        trackService.deleteTrack(trackId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Integer userId) {
        UserDto user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/enable")
    public ResponseEntity<UserDto> updateUserEnabledStatus(
            @PathVariable Integer userId,
            @Valid @RequestBody UserEnableRequestDto request) {
        UserDto updatedUser = userService.updateUserEnabledStatus(userId, request);
        return ResponseEntity.ok(updatedUser);
    }
}
