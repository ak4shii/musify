package com.musify.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistDetailResponseDto {

    PlaylistDto playlist;
    List<TrackDto> tracks;
}
