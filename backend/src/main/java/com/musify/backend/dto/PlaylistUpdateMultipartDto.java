package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PlaylistUpdateMultipartDto {

    @Size(max = 150, message = "Playlist name must not exceed 150 characters")
    private String playlistName;

    private Boolean isPublic;

    private MultipartFile coverImage;
}












