package com.musify.backend.service;

import com.musify.backend.dto.ArtistDto;

import java.util.List;

public interface IArtistService {

    List<ArtistDto> getArtistsForHome();

    List<ArtistDto> getArtistsForSearch(String query);
}
