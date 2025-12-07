package com.musify.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrackCreateRequestDto {

    @NotNull(message = "Album ID is required")
    private Integer albumId;

    @NotBlank(message = "Track title is required")
    @Size(max = 200, message = "Track title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "File path is required")
    private String filePath;

    @NotBlank(message = "Cover URL is required")
    private String coverUrl;

    @NotBlank(message = "Genre is required")
    @Size(max = 100, message = "Genre must not exceed 100 characters")
    private String genre;

    private String duration;

    @NotNull(message = "At least one artist ID is required")
    private List<Integer> artistIds;
}

