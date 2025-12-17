package com.musify.backend.service.impl;

import com.musify.backend.dto.ArtistCreateRequestDto;
import com.musify.backend.dto.ArtistDto;
import com.musify.backend.dto.ArtistUpdateRequestDto;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.Track;
import com.musify.backend.entity.User;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.AlbumArtistRepository;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.TrackArtistRepository;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.storage.FileStorageService;
import com.musify.backend.service.IArtistService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements IArtistService {

    private final ArtistRepository artistRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final TrackArtistRepository trackArtistRepository;
    private final AlbumArtistRepository albumArtistRepository;
    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;

    @Override
    public List<ArtistDto> getArtistsForHome() {
        return artistRepository.findTop10ByOrderByFollowersDesc().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<ArtistDto> getArtistsForSearch(String query) {
        return artistRepository.findTopByTitleContainingIgnoreCaseOrderByFollowersDesc(query, PageRequest.of(0, 10)).stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public Optional<ArtistDto> getArtistById(Long artistId) {
        return artistRepository.findById(artistId)
                .map(this::transformToDto);
    }

    @Override
    @Transactional
    public ArtistDto createArtist(ArtistCreateRequestDto request) {
        User authenticatedUser = getAuthenticatedCustomer();
        
        try {
            fileStorageService.createArtistFolderStructure(request.getArtistName());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create artist folder structure: " + e.getMessage());
        }

        Artist artist = new Artist();
        artist.setArtistName(request.getArtistName());
        artist.setProfileUrl(request.getProfileUrl());
        artist.setBiography(request.getBiography());
        artist.setCreatedBy(authenticatedUser.getEmail());

        Artist savedArtist = artistRepository.save(artist);
        return transformToDto(savedArtist);
    }

    @Override
    @Transactional
    public ArtistDto updateArtist(Integer artistId, ArtistUpdateRequestDto request) {
        User authenticatedUser = getAuthenticatedCustomer();
        
        Artist artist = artistRepository.findById(artistId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));

        if (request.getArtistName() != null) {
            artist.setArtistName(request.getArtistName());
        }
        if (request.getProfileUrl() != null) {
            artist.setProfileUrl(request.getProfileUrl());
        }
        if (request.getBiography() != null) {
            artist.setBiography(request.getBiography());
        }
        artist.setUpdatedBy(authenticatedUser.getEmail());

        Artist updatedArtist = artistRepository.save(artist);
        return transformToDto(updatedArtist);
    }

    @Override
    @Transactional
    public void deleteArtist(Integer artistId) {
        Artist artist = artistRepository.findById(artistId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));
        
        String artistName = artist.getArtistName();
        
        List<Album> artistAlbums = albumArtistRepository.findAlbumsByArtistId(artistId.longValue());
        List<Track> artistTracks = trackArtistRepository.findTracksByArtistId(artistId.longValue());
        
        for (Album album : artistAlbums) {
            long artistCount = albumArtistRepository.findAll().stream()
                    .filter(aa -> aa.getAlbum().getAlbumId().equals(album.getAlbumId()))
                    .count();
            
            if (artistCount == 1) {
                List<Track> albumTracks = trackRepository.findTracksByAlbumId(album.getAlbumId().longValue());
                trackRepository.deleteAll(albumTracks);
                albumRepository.delete(album);
            }
        }
        
        for (Track track : artistTracks) {
            if (!trackRepository.existsById(track.getTrackId().longValue())) {
                continue;
            }
            
            long artistCount = trackArtistRepository.findAll().stream()
                    .filter(ta -> ta.getTrack().getTrackId().equals(track.getTrackId()))
                    .count();
            
            if (artistCount == 1) {
                trackRepository.delete(track);
            }
        }
        
        try {
            fileStorageService.deleteArtistFolder(artistName);
        } catch (Exception e) {
            System.err.println("Failed to delete artist folder for " + artistName + ": " + e.getMessage());
        }
        
        artistRepository.delete(artist);
    }

    @Override
    public List<ArtistDto> getAllArtists() {
        return artistRepository.findAll().stream()
                .map(this::transformToDto)
                .collect(Collectors.toList());
    }

    ArtistDto transformToDto(Artist artist) {
        ArtistDto artistDto = new ArtistDto();
        BeanUtils.copyProperties(artist, artistDto);
        // Calculate actual follower count from UserArtistFollow table
        Long followerCount = artistRepository.countFollowersByArtistId(artist.getArtistId().longValue());
        artistDto.setFollowers(followerCount != null ? followerCount.intValue() : 0);
        return artistDto;
    }

    private User getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
    }
}
