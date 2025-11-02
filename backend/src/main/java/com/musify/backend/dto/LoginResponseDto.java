package com.musify.backend.dto;

public record LoginResponseDto(String message, UserDto user, String jwtToken) {

}
