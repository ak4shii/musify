package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistUpdateRequestDto {

    @Size(max = 150, message = "Artist name must not exceed 150 characters")
    private String artistName;

    private String profileUrl;

    private String biography;
}


