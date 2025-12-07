package com.musify.backend.service.impl;

import com.musify.backend.dto.ArtistCreateRequestDto;
import com.musify.backend.dto.ArtistDto;
import com.musify.backend.dto.ArtistUpdateRequestDto;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.User;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.FileStorageService;
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

    @Override
    public List<ArtistDto> getArtistsForHome() {
        return artistRepository.findTop10ByOrderByPopularityDesc().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<ArtistDto> getArtistsForSearch(String query) {
        return artistRepository.findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(query, PageRequest.of(0, 10)).stream()
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
        if (!artistRepository.existsById(artistId.longValue())) {
            throw new ResourceNotFoundException("Artist not found with id " + artistId);
        }
        artistRepository.deleteById(artistId.longValue());
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
        return artistDto;
    }

    private User getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
    }
}
