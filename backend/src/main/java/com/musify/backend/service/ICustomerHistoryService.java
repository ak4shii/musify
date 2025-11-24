package com.musify.backend.service;

import com.musify.backend.dto.TrackDto;

import java.util.List;

public interface ICustomerHistoryService {

    void saveListeningHistory(Long userId, Long trackId);

    List<TrackDto> getListeningHistory(Long userId);
}
