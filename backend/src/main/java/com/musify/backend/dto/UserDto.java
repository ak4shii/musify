package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
public class UserDto {

    private Integer userId;
    private String userName;
    private String email;
    private String profileUrl;
    private LocalDate dateOfBirth;
    private String role;
    private Boolean enabled;
}
