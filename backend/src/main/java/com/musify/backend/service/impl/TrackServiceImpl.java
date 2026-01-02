package com.musify.backend.service.impl;

import com.musify.backend.dto.TrackCreateMultipartDto;
import com.musify.backend.dto.TrackCreateRequestDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.dto.TrackUpdateRequestDto;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.Track;
import com.musify.backend.entity.TrackArtist;
import com.musify.backend.entity.TrackArtistId;
import com.musify.backend.entity.User;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.TrackArtistRepository;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.ITrackService;
import com.musify.backend.storage.FileStorageService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements ITrackService {

    private final TrackRepository trackRepository;
    private final TrackArtistRepository trackArtistRepository;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<TrackDto> getTracksForHome() {
        return trackRepository.findTop10ByOrderByPopularityDesc().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<TrackDto> getTracksForSearch(String query) {
        return trackRepository.findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(query, PageRequest.of(0, 10)).stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<TrackDto> getTracksByArtistId(Long artistId) {
        return trackArtistRepository.findTracksByArtistId(artistId).stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<TrackDto> getTracksByAlbumId(Long albumId) {
        return trackRepository.findTracksByAlbumId(albumId).stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TrackDto createTrack(TrackCreateRequestDto request) {
        User authenticatedUser = getAuthenticatedCustomer();
        
        Track track = new Track();
        
        if (request.getAlbumId() != null) {
            Album album = albumRepository.findById(request.getAlbumId().longValue())
                    .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + request.getAlbumId()));
            track.setAlbum(album);
        }
        
        track.setTitle(request.getTitle());
        track.setFilePath(request.getFilePath());
        track.setCoverUrl(request.getCoverUrl());
        track.setGenre(request.getGenre());
        track.setDuration(request.getDuration());
        track.setCreatedBy(authenticatedUser.getEmail());

        Track savedTrack = trackRepository.save(track);
        
        if (request.getArtistIds() != null && !request.getArtistIds().isEmpty()) {
            for (Integer artistId : request.getArtistIds()) {
                Artist artist = artistRepository.findById(artistId.longValue())
                        .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));
                
                Optional<TrackArtist> existingRelationship = trackArtistRepository
                        .findByTrackIdAndArtistId(savedTrack.getTrackId(), artist.getArtistId());
                
                if (existingRelationship.isEmpty()) {
                    TrackArtistId trackArtistId = new TrackArtistId();
                    trackArtistId.setTrackId(savedTrack.getTrackId());
                    trackArtistId.setArtistId(artist.getArtistId());
                    
                    TrackArtist trackArtist = new TrackArtist();
                    trackArtist.setId(trackArtistId);
                    trackArtist.setTrack(savedTrack);
                    trackArtist.setArtist(artist);
                    trackArtistRepository.save(trackArtist);
                }
            }
        }
        
        return transformToDto(savedTrack);
    }

    @Override
    @Transactional
    public TrackDto updateTrack(Integer trackId, TrackUpdateRequestDto request) {
        User authenticatedUser = getAuthenticatedCustomer();
        
        Track track = trackRepository.findById(trackId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + trackId));

        if (request.getAlbumId() != null) {
            Album album = albumRepository.findById(request.getAlbumId().longValue())
                    .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + request.getAlbumId()));
            track.setAlbum(album);
            track.setCoverUrl(album.getCoverUrl());
        }

        if (request.getTitle() != null) {
            track.setTitle(request.getTitle());
        }
        if (request.getFilePath() != null) {
            track.setFilePath(request.getFilePath());
        }
        if (request.getGenre() != null) {
            track.setGenre(request.getGenre());
        }
        if (request.getDuration() != null) {
            track.setDuration(request.getDuration());
        }
        track.setUpdatedBy(authenticatedUser.getEmail());

        Track updatedTrack = trackRepository.save(track);
        return transformToDto(updatedTrack);
    }

    @Override
    @Transactional
    public void deleteTrack(Integer trackId) {
        Track track = trackRepository.findById(trackId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id " + trackId));
        
        try {
            fileStorageService.deleteTrackFile(track.getFilePath());
        } catch (Exception e) {
            System.err.println("Failed to delete track file for " + track.getTitle() + ": " + e.getMessage());
        }
        
        trackRepository.delete(track);
    }

    @Override
    public List<TrackDto> getAllTracks() {
        return trackRepository.findAll().stream()
                .map(this::transformToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TrackDto> getTrackById(Integer trackId) {
        return trackRepository.findById(trackId.longValue())
                .map(this::transformToDto);
    }

    @Override
    @Transactional
    public TrackDto createTrackFromMultipart(TrackCreateMultipartDto multipartDto) throws IOException {
        if (multipartDto.getArtistIds() == null || multipartDto.getArtistIds().isEmpty()) {
            throw new IllegalArgumentException("At least one artist ID is required");
        }

        Album album = albumRepository.findById(multipartDto.getAlbumId().longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + multipartDto.getAlbumId()));

        Artist firstArtist = artistRepository.findById(multipartDto.getArtistIds().getFirst().longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + multipartDto.getArtistIds().getFirst()));

        String filePath = fileStorageService.uploadMp3FileToAlbum(
                multipartDto.getFile(), firstArtist.getArtistName(), album.getTitle());

        String duration;
        try {
            Path staticPath = Paths.get("src/main/resources/static");
            Path fullFilePath = staticPath.resolve(filePath.substring(1));
            duration = fileStorageService.extractMp3Duration(fullFilePath);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to extract duration from MP3 file: " + e.getMessage());
        }

        String coverUrl = album.getCoverUrl();

        TrackCreateRequestDto request = new TrackCreateRequestDto();
        request.setAlbumId(multipartDto.getAlbumId());
        request.setTitle(multipartDto.getTitle());
        request.setFilePath(filePath);
        request.setCoverUrl(coverUrl);
        request.setGenre(multipartDto.getGenre());
        request.setDuration(duration);
        request.setArtistIds(multipartDto.getArtistIds());

        return createTrack(request);
    }

    private TrackDto transformToDto(Track track) {
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

    private User getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
    }
}
