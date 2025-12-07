package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaylistUpdateRequestDto {

    @Size(max = 150, message = "Playlist name must not exceed 150 characters")
    private String playlistName;

    private Boolean isPublic;

    private String coverUrl;
}


