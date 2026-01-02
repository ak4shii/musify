package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaylistDto {

    private Integer playlistId;
    private Integer userId;
    private String userName;
    private String playlistName;
    private String coverUrl;
    private Boolean isPublic;
}
