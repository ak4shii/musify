package com.musify.backend.service.impl;

import com.musify.backend.dto.ArtistDto;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.User;
import com.musify.backend.entity.UserArtistFollow;
import com.musify.backend.entity.UserArtistFollowId;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.UserArtistFollowRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.IUserFollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserFollowServiceImpl implements IUserFollowService {

    private final UserArtistFollowRepository userArtistFollowRepository;
    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;

    @Override
    public void followArtist(Long userId, Long artistId) {
        if (isFollowing(userId, artistId)) return;

        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserArtistFollow follow = new UserArtistFollow();
        UserArtistFollowId id = new UserArtistFollowId();
        id.setUserId(userId.intValue());
        id.setArtistId(artistId.intValue());
        follow.setUserArtistFollowId(id);
        follow.setArtist(artist);
        follow.setUser(user);

        userArtistFollowRepository.save(follow);
    }

    @Override
    public void unfollowArtist(Long userId, Long artistId) {
        userArtistFollowRepository.findByUserUserIdAndArtistArtistId(userId, artistId)
                .ifPresent(userArtistFollowRepository::delete);
    }

    @Override
    public List<ArtistDto> getFollowedArtists(Long userId) {
        return userArtistFollowRepository.findAllByUserUserId(userId).stream()
                .map(UserArtistFollow::getArtist)
                .map(this::transformToDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFollowing(Long userId, Long artistId) {
        return userArtistFollowRepository.existsByUserUserIdAndArtistArtistId(userId, artistId);
    }

    ArtistDto transformToDto(Artist artist) {
        ArtistDto artistDto = new ArtistDto();
        BeanUtils.copyProperties(artist, artistDto);
        return artistDto;
    }
}
