package com.musify.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class AlbumCreateRequestDto {

    @NotBlank(message = "Album title is required")
    @Size(max = 200, message = "Album title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Cover URL is required")
    private String coverUrl;

    @NotNull(message = "Release date is required")
    private LocalDate releaseDate;

    @NotNull(message = "At least one artist ID is required")
    private List<Integer> artistIds;
}

