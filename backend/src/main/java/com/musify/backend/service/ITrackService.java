package com.musify.backend.service;

import com.musify.backend.dto.TrackDto;

import java.util.List;

public interface ITrackService {

    List<TrackDto> getTracks();
}
