package com.musify.backend.service;

import com.musify.backend.dto.TrackDto;

import java.util.List;

public interface ITrackService {

    List<TrackDto> getTracksForHome();

    List<TrackDto> getTracksForSearch(String query);

    List<TrackDto> getTracksByArtistId(Long artistId);

    List<TrackDto> getTracksByAlbumId(Long albumId);
}
