package com.musify.backend.controller;

import com.musify.backend.dto.*;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.service.IAlbumService;
import com.musify.backend.service.IArtistService;
import com.musify.backend.service.ITrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final IArtistService iArtistService;
    private final ITrackService iTrackService;
    private final IAlbumService iAlbumService;

    @GetMapping("/{artistId}")
    public ResponseEntity<?> getArtistById(@PathVariable Long artistId) {

        ArtistDto artist = iArtistService.getArtistById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id " + artistId));
        List<TrackDto> tracks = iTrackService.getTracksByArtistId(artistId);
        List<AlbumDto> albums = iAlbumService.getAlbumsByArtistId(artistId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(new ArtistDetailResponseDto(artist, albums, tracks));
    }
}
