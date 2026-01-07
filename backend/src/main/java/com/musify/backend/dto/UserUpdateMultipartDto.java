package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UserUpdateMultipartDto {

    @Size(max = 100, message = "User name must not exceed 100 characters")
    private String userName;

    private String dateOfBirth;

    private MultipartFile profileImage;
}
