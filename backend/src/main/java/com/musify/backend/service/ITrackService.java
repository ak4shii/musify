package com.musify.backend.service;

import com.musify.backend.dto.TrackCreateRequestDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.dto.TrackUpdateRequestDto;

import java.util.List;
import java.util.Optional;

public interface ITrackService {

    List<TrackDto> getTracksForHome();

    List<TrackDto> getTracksForSearch(String query);

    List<TrackDto> getTracksByArtistId(Long artistId);

    List<TrackDto> getTracksByAlbumId(Long albumId);

    TrackDto createTrack(TrackCreateRequestDto request);

    TrackDto updateTrack(Integer trackId, TrackUpdateRequestDto request);

    void deleteTrack(Integer trackId);

    List<TrackDto> getAllTracks();

    Optional<TrackDto> getTrackById(Integer trackId);
}
