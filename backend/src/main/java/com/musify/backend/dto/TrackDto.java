package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrackDto {

    private Integer trackId;
    private Integer albumId;
    private String title;
    private String filePath;
    private String coverUrl;
    private String genre;
    private Integer popularity;
    private String duration;
    private String primaryArtistName;
    private Integer primaryArtistId;
    private List<String> artistNames;
}
