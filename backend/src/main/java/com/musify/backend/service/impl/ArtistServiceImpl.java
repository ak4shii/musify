package com.musify.backend.service.impl;

import com.musify.backend.dto.ArtistDto;
import com.musify.backend.entity.Artist;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.service.IArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements IArtistService {

    private final ArtistRepository artistRepository;

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


    ArtistDto transformToDto(Artist artist) {
        ArtistDto artistDto = new ArtistDto();
        BeanUtils.copyProperties(artist, artistDto);
        return artistDto;
    }
}
