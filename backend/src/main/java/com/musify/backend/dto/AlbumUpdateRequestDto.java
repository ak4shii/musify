package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AlbumUpdateRequestDto {

    @Size(max = 200, message = "Album title must not exceed 200 characters")
    private String title;

    private String coverUrl;

    private LocalDate releaseDate;
}


