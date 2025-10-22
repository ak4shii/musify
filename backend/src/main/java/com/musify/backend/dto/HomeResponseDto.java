package com.musify.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeResponseDto {

    private List<TrackDto> tracks;
    private List<AlbumDto> albums;
    private List<ArtistDto> artists;
}
