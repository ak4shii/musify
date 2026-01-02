package com.musify.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class TrackCreateMultipartDto {

    @NotNull(message = "Album ID is required")
    private Integer albumId;

    @NotBlank(message = "Track title is required")
    @Size(max = 200, message = "Track title must not exceed 200 characters")
    private String title;

    @NotNull(message = "MP3 file is required")
    private MultipartFile file;

    @NotBlank(message = "Genre is required")
    @Size(max = 100, message = "Genre must not exceed 100 characters")
    private String genre;

    @NotNull(message = "At least one artist ID is required")
    private List<Integer> artistIds;
}












