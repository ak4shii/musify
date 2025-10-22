package com.musify.backend.service.impl;

import com.musify.backend.dto.TrackDto;
import com.musify.backend.entity.Track;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.service.ITrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements ITrackService {

    private final TrackRepository trackRepository;

    @Override
    public List<TrackDto> getTracks() {
        return trackRepository.findAll().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    private TrackDto transformToDto(Track track) {
        TrackDto trackDto = new TrackDto();
        BeanUtils.copyProperties(track, trackDto);
        return trackDto;
    }
}
