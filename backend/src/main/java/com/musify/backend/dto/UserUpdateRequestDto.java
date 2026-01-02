package com.musify.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserUpdateRequestDto {

    @Size(max = 100, message = "User name must not exceed 100 characters")
    private String userName;

    private String profileUrl;

    private LocalDate dateOfBirth;
}













