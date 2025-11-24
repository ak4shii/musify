package com.musify.backend.service;

import com.musify.backend.dto.ArtistDto;

import java.util.List;

public interface IUserFollowService {

    void followArtist(Long userId, Long artistId);

    void unfollowArtist(Long userId, Long artistId);

    List<ArtistDto> getFollowedArtists(Long userId);

    boolean isFollowing(Long userId, Long artistId);
}
