package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistDto {

    private Integer artistId;
    private String artistName;
    private String profileUrl;
    private String biography;
    private Integer followers;
}
