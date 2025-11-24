package com.musify.backend.controller;

import com.musify.backend.dto.AlbumDetailResponseDto;
import com.musify.backend.dto.AlbumDto;
import com.musify.backend.dto.TrackDto;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.service.IAlbumService;
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
@RequestMapping("/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final IAlbumService iAlbumService;
    private final ITrackService iTrackService;

    @GetMapping("/{albumId}")
    public ResponseEntity<?> getAlbum(@PathVariable("albumId") Long albumId) {

        AlbumDto album = iAlbumService.getAlbumById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id " + albumId));
        List<TrackDto> tracks = iTrackService.getTracksByAlbumId(albumId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(new AlbumDetailResponseDto(album, tracks));
    }
}
