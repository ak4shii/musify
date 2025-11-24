package com.musify.backend.service;

import com.musify.backend.dto.ArtistDto;

import java.util.List;
import java.util.Optional;

public interface IArtistService {

    List<ArtistDto> getArtistsForHome();

    List<ArtistDto> getArtistsForSearch(String query);

    Optional<ArtistDto> getArtistById(Long artistId);
}
