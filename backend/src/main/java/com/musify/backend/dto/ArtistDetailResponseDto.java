package com.musify.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDetailResponseDto {

    ArtistDto artist;
    List<AlbumDto> albums;
    List<TrackDto> tracks;
}
