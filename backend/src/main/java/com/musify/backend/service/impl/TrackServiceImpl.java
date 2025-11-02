package com.musify.backend.service.impl;

import com.musify.backend.dto.TrackDto;
import com.musify.backend.entity.Track;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.service.ITrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements ITrackService {

    private final TrackRepository trackRepository;

    @Override
    public List<TrackDto> getTracksForHome() {
        return trackRepository.findTop10ByOrderByPopularityDesc().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    @Override
    public List<TrackDto> getTracksForSearch(String query) {
        return trackRepository.findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(query, PageRequest.of(0, 10)).stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    private TrackDto transformToDto(Track track) {
        TrackDto trackDto = new TrackDto();
        BeanUtils.copyProperties(track, trackDto);
        return trackDto;
    }
}
