package com.musify.backend.service;

import com.musify.backend.dto.TrackDto;

import java.util.List;

public interface IUserLikeService {

    void likeTrack(Long userId, Long trackId);

    void unlikeTrack(Long userId, Long trackId);

    List<TrackDto> getLikedTracks(Long userId);

    boolean hasLiked(Long userId, Long trackId);
}
