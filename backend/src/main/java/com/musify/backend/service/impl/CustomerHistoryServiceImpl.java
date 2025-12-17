package com.musify.backend.service.impl;

import com.musify.backend.dto.TrackDto;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.CustomerHistory;
import com.musify.backend.entity.Track;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.CustomerHistoryRepository;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.ICustomerHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerHistoryServiceImpl implements ICustomerHistoryService {

    private final CustomerHistoryRepository customerHistoryRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;

    @Override
    @Transactional
    public void saveListeningHistory(Long userId, Long trackId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found"));
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomerHistory history = new CustomerHistory();
        history.setTrack(track);
        history.setUser(user);
        history.setPlayedAt(Instant.now());

        customerHistoryRepository.save(history);
        
        Integer currentPopularity = track.getPopularity() != null ? track.getPopularity() : 0;
        track.setPopularity(currentPopularity + 1);
        trackRepository.save(track);
        
        Album album = track.getAlbum();
        if (album != null) {
            Integer currentAlbumPopularity = album.getPopularity() != null ? album.getPopularity() : 0;
            album.setPopularity(currentAlbumPopularity + 1);
            albumRepository.save(album);
        }
    }

    @Override
    public List<TrackDto> getListeningHistory(Long userId) {
        return customerHistoryRepository.findAllByUserUserIdOrderByPlayedAtDesc(userId).stream()
                .map(CustomerHistory::getTrack)
                .map(this::transformToDto)
                .collect(Collectors.toList());
    }

    private TrackDto transformToDto(Track track) {
        TrackDto trackDto = new TrackDto();
        BeanUtils.copyProperties(track, trackDto);
        if (track.getAlbum() != null) {
            trackDto.setAlbumId(track.getAlbum().getAlbumId());
        }
        return trackDto;
    }
}
