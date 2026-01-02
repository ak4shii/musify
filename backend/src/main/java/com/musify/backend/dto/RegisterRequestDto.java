package com.musify.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequestDto {

    @NotBlank(message = "Display name is required")
    @Size(min = 8, max = 50, message = "Display name length must be between 8 and 50 characters")
    private String userName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Email address is required")
    @Email(message = "Email must be a valid format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 20, message = "Password length must be between 8 and 20 characters")
    private String password;
}
