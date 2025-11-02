package com.musify.backend.controller;

import com.musify.backend.dto.*;
import com.musify.backend.service.IAlbumService;
import com.musify.backend.service.IArtistService;
import com.musify.backend.service.ITrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class SearchController {

    private final ITrackService iTrackService;
    private final IAlbumService iAlbumService;
    private final IArtistService iArtistService;

    @PostMapping("/search")
    public ResponseEntity<SearchResponseDto> getSearchData(@RequestParam("q") String query) {
        List<TrackDto> tracks = iTrackService.getTracksForSearch(query);
        List<AlbumDto> albums = iAlbumService.getAlbumsForSearch(query);
        List<ArtistDto> artists = iArtistService.getArtistsForSearch(query);

        return ResponseEntity.status(HttpStatus.OK).
                body(new SearchResponseDto(tracks, albums, artists));
    }
}

