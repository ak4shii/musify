package com.musify.backend.service;

import com.musify.backend.dto.ArtistCreateRequestDto;
import com.musify.backend.dto.ArtistDto;
import com.musify.backend.dto.ArtistUpdateRequestDto;

import java.util.List;
import java.util.Optional;

public interface IArtistService {

    List<ArtistDto> getArtistsForHome();

    List<ArtistDto> getArtistsForSearch(String query);

    Optional<ArtistDto> getArtistById(Long artistId);

    ArtistDto createArtist(ArtistCreateRequestDto request);

    ArtistDto updateArtist(Integer artistId, ArtistUpdateRequestDto request);

    void deleteArtist(Integer artistId);

    List<ArtistDto> getAllArtists();
}
