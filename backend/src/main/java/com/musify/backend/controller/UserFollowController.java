package com.musify.backend.controller;

import com.musify.backend.dto.ArtistDto;
import com.musify.backend.service.IUserFollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserFollowController {

    private final IUserFollowService iUserFollowService;

    @PostMapping("/{userId}/follow/{artistId}")
    public ResponseEntity<?> followArtist(@PathVariable Long userId, @PathVariable Long artistId) {
        if (iUserFollowService.isFollowing(userId, artistId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User already follows this artist");
        }
        iUserFollowService.followArtist(userId, artistId);
        return ResponseEntity.status(HttpStatus.OK)
                .body("Artist followed successfully");
    }

    @DeleteMapping("/{userId}/unfollow/{artistId}")
    public ResponseEntity<?> unfollowArtist(@PathVariable Long userId, @PathVariable Long artistId) {
        if (!iUserFollowService.isFollowing(userId, artistId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User is not following this artist");
        }
        iUserFollowService.unfollowArtist(userId, artistId);
        return ResponseEntity.status(HttpStatus.OK)
                .body("Artist unfollowed successfully");
    }

    @GetMapping("/{userId}/followed-artists")
    public ResponseEntity<List<ArtistDto>> getFollowedArtists(@PathVariable Long userId) {
        List<ArtistDto> artists = iUserFollowService.getFollowedArtists(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(artists);
    }
}
