package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ArtistUpdateMultipartDto {

    @Size(max = 150, message = "Artist name must not exceed 150 characters")
    private String artistName;

    private String biography;

    private MultipartFile profileImage;
}












