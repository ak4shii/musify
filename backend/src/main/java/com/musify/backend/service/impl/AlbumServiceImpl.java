package com.musify.backend.service.impl;

import com.musify.backend.dto.AlbumCreateRequestDto;
import com.musify.backend.dto.AlbumDto;
import com.musify.backend.dto.AlbumUpdateRequestDto;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.AlbumArtist;
import com.musify.backend.entity.AlbumArtistId;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.User;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.AlbumArtistRepository;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.FileStorageService;
import com.musify.backend.service.IAlbumService;
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
public class AlbumServiceImpl implements IAlbumService {

    private final AlbumRepository albumRepository;
    private final AlbumArtistRepository albumArtistRepository;
    private final ArtistRepository artistRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @Override
    public List<AlbumDto> getAlbumsForHome() {
        return albumRepository.findTop10ByOrderByPopularityDesc().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<AlbumDto> getAlbumsForSearch(String query) {
        return albumRepository.findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(query, PageRequest.of(0, 10)).stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<AlbumDto> getAlbumsByArtistId(Long artistId) {
        return albumArtistRepository.findAlbumsByArtistId(artistId).stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public Optional<AlbumDto> getAlbumById(Long albumId) {
        return albumRepository.findById(albumId)
                .map(this::transformToDto);
    }

    @Override
    @Transactional
    public AlbumDto createAlbum(AlbumCreateRequestDto request) {
        User authenticatedUser = getAuthenticatedCustomer();
        
        Album album = new Album();
        album.setTitle(request.getTitle());
        album.setCoverUrl(request.getCoverUrl());
        album.setReleaseDate(request.getReleaseDate());
        album.setCreatedBy(authenticatedUser.getEmail());

        Album savedAlbum = albumRepository.save(album);
        
        if (request.getArtistIds() != null && !request.getArtistIds().isEmpty()) {
            Artist firstArtist = null;
            for (Integer artistId : request.getArtistIds()) {
                Artist artist = artistRepository.findById(artistId.longValue())
                        .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));
                
                if (firstArtist == null) {
                    firstArtist = artist;
                }
                
                Optional<AlbumArtist> existingRelationship = albumArtistRepository
                        .findByAlbumIdAndArtistId(savedAlbum.getAlbumId(), artist.getArtistId());
                
                if (existingRelationship.isEmpty()) {
                    AlbumArtistId albumArtistId = new AlbumArtistId();
                    albumArtistId.setAlbumId(savedAlbum.getAlbumId());
                    albumArtistId.setArtistId(artist.getArtistId());
                    
                    AlbumArtist albumArtist = new AlbumArtist();
                    albumArtist.setId(albumArtistId);
                    albumArtist.setAlbum(savedAlbum);
                    albumArtist.setArtist(artist);
                    albumArtistRepository.save(albumArtist);
                }
            }
            
            if (firstArtist != null) {
                try {
                    fileStorageService.createAlbumFolderStructure(firstArtist.getArtistName(), savedAlbum.getTitle());
                } catch (Exception e) {
                    throw new RuntimeException("Failed to create album folder structure: " + e.getMessage());
                }
            }
        }
        
        return transformToDto(savedAlbum);
    }

    @Override
    @Transactional
    public AlbumDto updateAlbum(Integer albumId, AlbumUpdateRequestDto request) {
        User authenticatedUser = getAuthenticatedCustomer();
        
        Album album = albumRepository.findById(albumId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + albumId));

        if (request.getTitle() != null) {
            album.setTitle(request.getTitle());
        }
        if (request.getCoverUrl() != null) {
            album.setCoverUrl(request.getCoverUrl());
        }
        if (request.getReleaseDate() != null) {
            album.setReleaseDate(request.getReleaseDate());
        }
        album.setUpdatedBy(authenticatedUser.getEmail());

        Album updatedAlbum = albumRepository.save(album);
        return transformToDto(updatedAlbum);
    }

    @Override
    @Transactional
    public void deleteAlbum(Integer albumId) {
        if (!albumRepository.existsById(albumId.longValue())) {
            throw new ResourceNotFoundException("Album not found with id " + albumId);
        }
        albumRepository.deleteById(albumId.longValue());
    }

    @Override
    public List<AlbumDto> getAllAlbums() {
        return albumRepository.findAll().stream()
                .map(this::transformToDto)
                .collect(Collectors.toList());
    }

    AlbumDto transformToDto(Album album) {
        AlbumDto albumDto = new AlbumDto();
        BeanUtils.copyProperties(album, albumDto);
        return albumDto;
    }

    private User getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
    }
}
