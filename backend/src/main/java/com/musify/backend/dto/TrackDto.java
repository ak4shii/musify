package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Duration;

@Getter
@Setter
public class TrackDto {

    private Integer trackId;
    private AlbumDto album;
    private String title;
    private String filePath;
    private String coverUrl;
    private String genre;
    private Integer popularity;
    private String duration;
}
