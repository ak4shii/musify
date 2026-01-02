package com.musify.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PlaylistCreateMultipartDto {

    @NotBlank(message = "Playlist name is required")
    @Size(max = 200, message = "Playlist name must not exceed 200 characters")
    private String playlistName;

    private Boolean isPublic;

    private MultipartFile coverImage;
}












