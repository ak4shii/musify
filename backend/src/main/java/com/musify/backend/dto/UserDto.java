package com.musify.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserDto {

    private Long userId;
    private String userName;
    private String email;
    private String profileUrl;
    private String dateOfBirth;
    private String role;
    private Boolean enabled;
}
