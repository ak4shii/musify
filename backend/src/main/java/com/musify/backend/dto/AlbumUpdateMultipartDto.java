package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class AlbumUpdateMultipartDto {

    @Size(max = 200, message = "Album title must not exceed 200 characters")
    private String title;

    private String releaseDate;

    private MultipartFile coverImage;
}

