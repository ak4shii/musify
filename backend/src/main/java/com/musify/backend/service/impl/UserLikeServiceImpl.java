package com.musify.backend.service.impl;

import com.musify.backend.dto.TrackDto;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.Track;
import com.musify.backend.entity.User;
import com.musify.backend.entity.UserTrackLike;
import com.musify.backend.entity.UserTrackLikeId;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.TrackArtistRepository;
import com.musify.backend.repository.TrackRepository;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.repository.UserTrackLikeRepository;
import com.musify.backend.service.IUserLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserLikeServiceImpl implements IUserLikeService {

    private final UserTrackLikeRepository userTrackLikeRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;
    private final TrackArtistRepository trackArtistRepository;

    @Override
    public void likeTrack(Long userId, Long trackId) {
        if (userTrackLikeRepository.existsByUserUserIdAndTrackTrackId(userId, trackId)) {
            return;
        }

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserTrackLike like = new UserTrackLike();
        UserTrackLikeId id = new UserTrackLikeId();
        id.setUserId(userId.intValue());
        id.setTrackId(trackId.intValue());
        like.setUserTrackLikeId(id);

        like.setTrack(track);
        like.setUser(user);

        userTrackLikeRepository.save(like);
    }

    @Override
    public void unlikeTrack(Long userId, Long trackId) {
        userTrackLikeRepository.findByUserUserIdAndTrackTrackId(userId, trackId)
                .ifPresent(userTrackLikeRepository::delete);
    }

    @Override
    public boolean hasLiked(Long userId, Long trackId) {
        return userTrackLikeRepository.findByUserUserIdAndTrackTrackId(userId, trackId).isPresent();
    }

    @Override
    public List<TrackDto> getLikedTracks(Long userId) {
        return userTrackLikeRepository.findAllByUserUserId(userId).stream()
                .map(UserTrackLike::getTrack)
                .map(this::transformToDto)
                .collect(Collectors.toList());
    }


    private TrackDto transformToDto(Track track) {
        TrackDto trackDto = new TrackDto();
        BeanUtils.copyProperties(track, trackDto);
        if (track.getAlbum() != null) {
            trackDto.setAlbumId(track.getAlbum().getAlbumId());
        }
        List<Artist> artists = trackArtistRepository.findArtistsByTrackId(track.getTrackId());
        List<String> artistNames = artists.stream()
                .map(Artist::getArtistName)
                .collect(Collectors.toList());
        trackDto.setArtistNames(artistNames);
        if (!artists.isEmpty()) {
            Artist primaryArtist = artists.get(0);
            trackDto.setPrimaryArtistName(primaryArtist.getArtistName());
            trackDto.setPrimaryArtistId(primaryArtist.getArtistId());
        }
        return trackDto;
    }
}
