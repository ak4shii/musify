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
public class AlbumCreateMultipartDto {

    @NotBlank(message = "Album title is required")
    @Size(max = 200, message = "Album title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Release date is required")
    private String releaseDate;

    @NotNull(message = "Cover image is required")
    private MultipartFile coverImage;

    @NotNull(message = "At least one artist ID is required")
    private List<Integer> artistIds;
}

