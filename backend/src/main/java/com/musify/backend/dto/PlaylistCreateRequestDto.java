package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaylistCreateRequestDto {

    private String playlistName;
    private Boolean isPublic;
    private String coverUrl;
}