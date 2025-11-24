package com.musify.backend.service.impl;

import com.musify.backend.dto.PlaylistDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.entity.*;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.PlaylistRepository;
import com.musify.backend.repository.PlaylistTrackRepository;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.IPlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return playlistRepository.findPlaylistsByUser(user).stream()
                .map(this::transformToDtoForPlaylist).collect(Collectors.toList());
    }

    @Override
    public PlaylistDto updatePlaylistName(Long playlistId, String playlistNewName) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));

        playlist.setPlaylistName(playlistNewName);
        return transformToDtoForPlaylist(playlistRepository.save(playlist));
    }

    @Override
    public void deletePlaylist(Long playlistId) {
        playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));

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
    }

    @Override
    public void removeTrackFromPlaylist(Long playlistId, Long trackId) {
        playlistRepository.findById(playlistId)
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
    public void checkPlaylistOwner(Long userId, Long playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
        if (!playlist.getUser().getUserId().equals(userId.intValue())) {
            throw new RuntimeException("You are not the owner of this playlist");
        }
    }

    private TrackDto transformToDtoForTrack(Track track) {
        TrackDto trackDto = new TrackDto();
        BeanUtils.copyProperties(track, trackDto);
        if (track.getAlbum() != null) {
            trackDto.setAlbumId(track.getAlbum().getAlbumId());
        }
        return trackDto;
    }

    private PlaylistDto transformToDtoForPlaylist(Playlist playlist) {
        PlaylistDto playlistDto = new PlaylistDto();
        BeanUtils.copyProperties(playlist, playlistDto);
        if (playlist.getUser() != null) {
            playlistDto.setUserId(playlist.getUser().getUserId());
        }
        return playlistDto;
    }

    private User getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
    }
}
