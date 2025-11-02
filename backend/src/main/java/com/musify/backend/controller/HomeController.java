package com.musify.backend.controller;

import com.musify.backend.dto.AlbumDto;
import com.musify.backend.dto.ArtistDto;
import com.musify.backend.dto.HomeResponseDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.service.IAlbumService;
import com.musify.backend.service.IArtistService;
import com.musify.backend.service.ITrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class HomeController {

    private final ITrackService iTrackService;
    private final IAlbumService iAlbumService;
    private final IArtistService iArtistService;

    @GetMapping
    public ResponseEntity<HomeResponseDto> getHomeData() {
        List<TrackDto> tracks = iTrackService.getTracksForHome();
        List<AlbumDto> albums = iAlbumService.getAlbumsForHome();
        List<ArtistDto> artists = iArtistService.getArtistsForHome();

        return ResponseEntity.status(HttpStatus.OK).
                body(new HomeResponseDto(tracks, albums, artists));
    }
}
