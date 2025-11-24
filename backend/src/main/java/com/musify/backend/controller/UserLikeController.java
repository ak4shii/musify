package com.musify.backend.controller;

import com.musify.backend.dto.TrackDto;
import com.musify.backend.service.IUserLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserLikeController {

    private final IUserLikeService iUserLikeService;

    @PostMapping("/{userId}/like/{trackId}")
    public ResponseEntity<?> likeTrack(@PathVariable Long userId, @PathVariable Long trackId) {
        if (iUserLikeService.hasLiked(userId, trackId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User already likes this track");
        }
        iUserLikeService.likeTrack(userId, trackId);
        return ResponseEntity.ok()
                .body("Track liked successfully");
    }

    @DeleteMapping("/{userId}/unlike/{trackId}")
    public ResponseEntity<?> unlikeTrack(@PathVariable Long userId, @PathVariable Long trackId) {
        if (!iUserLikeService.hasLiked(userId, trackId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User is not liking this track");
        }
        iUserLikeService.unlikeTrack(userId, trackId);
        return ResponseEntity.status(HttpStatus.OK)
                .body("Track unliked successfully");
    }

    @GetMapping("{userId}/liked-tracks")
    public ResponseEntity<List<TrackDto>> getLikedTracks(@PathVariable Long userId) {
        List<TrackDto> tracks = iUserLikeService.getLikedTracks(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(tracks);
    }
}
