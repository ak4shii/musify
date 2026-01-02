package com.musify.backend.service.impl;

import com.musify.backend.dto.PlaylistCreateMultipartDto;
import com.musify.backend.dto.PlaylistDto;
import com.musify.backend.dto.PlaylistUpdateMultipartDto;
import com.musify.backend.dto.PlaylistUpdateRequestDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.entity.Playlist;
import com.musify.backend.entity.PlaylistTrack;
import com.musify.backend.entity.PlaylistTrackId;
import com.musify.backend.entity.Track;
import com.musify.backend.entity.User;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.entity.Artist;
import com.musify.backend.repository.PlaylistRepository;
import com.musify.backend.repository.PlaylistTrackRepository;
import com.musify.backend.repository.TrackArtistRepository;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.IPlaylistService;
import com.musify.backend.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements IPlaylistService {

    private final PlaylistRepository playlistRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final PlaylistTrackRepository playlistTrackRepository;
    private final FileStorageService fileStorageService;
    private final TrackArtistRepository trackArtistRepository;

    @Override
    public void createPlaylist(Long userId, String playlistName, Boolean isPublic, String coverUrl) {
        User authenticatedUser = getAuthenticatedCustomer();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!authenticatedUser.getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You can only create playlists for your own account");
        }

        Playlist playlist = new Playlist();
        playlist.setUser(user);
        playlist.setPlaylistName(playlistName);
        playlist.setIsPublic(isPublic != null);
        playlist.setCoverUrl(coverUrl);
        playlist.setCreatedBy(authenticatedUser.getEmail());
        playlistRepository.save(playlist);
    }

    @Override
    public Optional<PlaylistDto> getPlaylistById(Long playlistId) {
        return playlistRepository.findById(playlistId)
                .map(this::transformToDtoForPlaylist);
    }

    @Override
    public List<PlaylistDto> getPlaylistsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        List<Playlist> playlistsByUser = playlistRepository.findPlaylistsByUser(user);
        List<Playlist> playlistsByUserId = playlistRepository.findByUserId(user.getUserId());
        
        List<Playlist> playlists = playlistsByUserId.size() > 0 ? playlistsByUserId : playlistsByUser;
        
        return playlists.stream()
                .map(this::transformToDtoForPlaylist).collect(Collectors.toList());
    }

    @Override
    public PlaylistDto updatePlaylist(Long playlistId, PlaylistUpdateRequestDto request) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));

        if (request.getPlaylistName() != null) {
            playlist.setPlaylistName(request.getPlaylistName());
        }
        if (request.getIsPublic() != null) {
            playlist.setIsPublic(request.getIsPublic());
        }
        if (request.getCoverUrl() != null) {
            playlist.setCoverUrl(request.getCoverUrl());
        }

        return transformToDtoForPlaylist(playlistRepository.save(playlist));
    }

    @Override
    public void deletePlaylist(Long playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));

        Integer userId = playlist.getUser().getUserId();
        
        try {
            fileStorageService.deletePlaylistCoverFolder(userId, playlistId.intValue());
        } catch (IOException e) {
        }

        playlistRepository.deleteById(playlistId);
    }

    @Override
    public void addTrackToPlaylist(Long playlistId, Long trackId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found"));

        PlaylistTrackId playlistTrackId = new PlaylistTrackId();
        playlistTrackId.setPlaylistId(playlist.getPlaylistId());
        playlistTrackId.setTrackId(track.getTrackId());

        if (playlistTrackRepository.existsById(playlistTrackId)) {
            throw new RuntimeException("Track is already in playlist");
        }

        PlaylistTrack playlistTrack = new PlaylistTrack();
        playlistTrack.setId(playlistTrackId);
        playlistTrack.setPlaylist(playlist);
        playlistTrack.setTrack(track);

        playlistTrackRepository.save(playlistTrack);
        playlistRepository.save(playlist);
    }

    @Override
    public void removeTrackFromPlaylist(Long playlistId, Long trackId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
        trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found"));

        PlaylistTrackId playlistTrackId = new PlaylistTrackId();
        playlistTrackId.setPlaylistId(playlistId.intValue());
        playlistTrackId.setTrackId(trackId.intValue());

        if (!playlistTrackRepository.existsById(playlistTrackId)) {
            throw new RuntimeException("Track is not in playlist");
        }

        playlistTrackRepository.deleteById(playlistTrackId);
        playlistRepository.save(playlist);
    }

    @Override
    public List<TrackDto> getTracksInPlaylist(Long playlistId) {
        playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));

        return playlistTrackRepository.findByPlaylist_PlaylistId(playlistId.intValue()).stream()
                .map(PlaylistTrack::getTrack)
                .map(this::transformToDtoForTrack)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlaylistDto> getPublicPlaylistsForSearch(String query) {
        return playlistRepository.searchPublicPlaylists(query).stream()
                .map(this::transformToDtoForPlaylist)
                .collect(Collectors.toList());
    }

    @Override
    public void checkPlaylistOwner(Long userId, Long playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
        if (!playlist.getUser().getUserId().equals(userId.intValue())) {
            throw new RuntimeException("You are not the owner of this playlist");
        }
    }

    @Override
    @Transactional
    public void createPlaylistFromMultipart(Long userId, PlaylistCreateMultipartDto multipartDto) throws IOException {
        User authenticatedUser = getAuthenticatedCustomer();
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!authenticatedUser.getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You can only create playlists for your own account");
        }

        Playlist playlist = new Playlist();
        playlist.setUser(user);
        playlist.setPlaylistName(multipartDto.getPlaylistName());
        playlist.setIsPublic(multipartDto.getIsPublic() != null);
        playlist.setCreatedBy(authenticatedUser.getEmail());
        
        Playlist savedPlaylist = playlistRepository.save(playlist);
        playlistRepository.flush();

        if (multipartDto.getCoverImage() != null && !multipartDto.getCoverImage().isEmpty()) {
            String coverUrl = fileStorageService.uploadPlaylistCoverImageToUploads(
                    multipartDto.getCoverImage(), userId.intValue(), savedPlaylist.getPlaylistId());
            savedPlaylist.setCoverUrl(coverUrl);
            playlistRepository.save(savedPlaylist);
        }
    }

    @Override
    public PlaylistDto updatePlaylistFromMultipart(Long playlistId, PlaylistUpdateMultipartDto multipartDto) throws IOException {
        PlaylistUpdateRequestDto request = new PlaylistUpdateRequestDto();

        if (multipartDto.getPlaylistName() != null) {
            request.setPlaylistName(multipartDto.getPlaylistName());
        }
        if (multipartDto.getIsPublic() != null) {
            request.setIsPublic(multipartDto.getIsPublic());
        }

        if (multipartDto.getCoverImage() != null && !multipartDto.getCoverImage().isEmpty()) {
            Playlist playlist = playlistRepository.findById(playlistId)
                    .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
            
            Integer userId = playlist.getUser().getUserId();
            String coverUrl = fileStorageService.uploadPlaylistCoverImageToUploads(
                    multipartDto.getCoverImage(), userId, playlistId.intValue());
            request.setCoverUrl(coverUrl);
        }

        return updatePlaylist(playlistId, request);
    }

    private TrackDto transformToDtoForTrack(Track track) {
        TrackDto trackDto = new TrackDto();
        BeanUtils.copyProperties(track, trackDto);
        if (track.getAlbum() != null) {
            trackDto.setAlbumId(track.getAlbum().getAlbumId());
        }
        List<Artist> artists = trackArtistRepository.findArtistsByTrackId(track.getTrackId());
        List<String> artistNames = artists.stream()
                .map(Artist::getArtistName)
                .collect(Collectors.toList());
        trackDto.setArtistNames(artistNames);
        if (!artists.isEmpty()) {
            Artist primaryArtist = artists.get(0);
            trackDto.setPrimaryArtistName(primaryArtist.getArtistName());
            trackDto.setPrimaryArtistId(primaryArtist.getArtistId());
        }
        return trackDto;
    }

    private PlaylistDto transformToDtoForPlaylist(Playlist playlist) {
        PlaylistDto playlistDto = new PlaylistDto();
        BeanUtils.copyProperties(playlist, playlistDto);
        if (playlist.getUser() != null) {
            playlistDto.setUserId(playlist.getUser().getUserId());
            playlistDto.setUserName(playlist.getUser().getUserName());
        }
        return playlistDto;
    }

    private User getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new UsernameNotFoundException("Authentication not found. Please log in.");
        }
        
        String email = null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof String) {
            email = (String) principal;
        } else if (principal != null) {
            email = principal.toString();
        }
        
        if (email == null || email.trim().isEmpty()) {
            throw new UsernameNotFoundException("Email not found in authentication token. Principal: " + principal);
        }

        final String trimmedEmail = email.trim();
        return userRepository.findByEmail(trimmedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + trimmedEmail));
    }
}
