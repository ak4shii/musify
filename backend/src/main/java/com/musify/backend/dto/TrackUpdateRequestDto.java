package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrackUpdateRequestDto {

    private Integer albumId;

    @Size(max = 200, message = "Track title must not exceed 200 characters")
    private String title;

    private String filePath;

    private String coverUrl;

    @Size(max = 100, message = "Genre must not exceed 100 characters")
    private String genre;

    private String duration;
}


