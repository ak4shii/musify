package com.musify.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserEnableRequestDto {

    @NotNull(message = "Enabled status is required")
    private Boolean enabled;
}


