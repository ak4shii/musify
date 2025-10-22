package com.musify.backend.service.impl;

import com.musify.backend.dto.ArtistDto;
import com.musify.backend.entity.Artist;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.service.IArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements IArtistService {

    private final ArtistRepository artistRepository;

    @Override
    public List<ArtistDto> getArtists() {
        return artistRepository.findAll().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    ArtistDto transformToDto(Artist artist) {
        ArtistDto artistDto = new ArtistDto();
        BeanUtils.copyProperties(artist, artistDto);
        return artistDto;
    }
}
