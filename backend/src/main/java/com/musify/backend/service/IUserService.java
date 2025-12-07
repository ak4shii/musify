package com.musify.backend.service;

import com.musify.backend.dto.UserDto;
import com.musify.backend.dto.UserEnableRequestDto;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    List<UserDto> getAllUsers();

    Optional<UserDto> getUserById(Integer userId);

    UserDto updateUserEnabledStatus(Integer userId, UserEnableRequestDto request);
}


