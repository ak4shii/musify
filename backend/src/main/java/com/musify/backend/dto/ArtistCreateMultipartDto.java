package com.musify.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ArtistCreateMultipartDto {

    @NotBlank(message = "Artist name is required")
    @Size(max = 150, message = "Artist name must not exceed 150 characters")
    private String artistName;

    @NotBlank(message = "Biography is required")
    private String biography;

    private MultipartFile profileImage;
}












