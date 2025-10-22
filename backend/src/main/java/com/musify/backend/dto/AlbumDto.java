package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AlbumDto {

    private Integer albumId;
    private String title;
    private String coverUrl;
    private LocalDate releaseDate;
}
