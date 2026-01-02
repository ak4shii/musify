package com.musify.backend.service;

import com.musify.backend.dto.UserDto;
import com.musify.backend.dto.UserEnableRequestDto;
import com.musify.backend.dto.UserUpdateMultipartDto;
import com.musify.backend.dto.UserUpdateRequestDto;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IUserService {

    List<UserDto> getAllUsers();

    Optional<UserDto> getUserById(Integer userId);

    UserDto updateUserEnabledStatus(Integer userId, UserEnableRequestDto request);

    UserDto updateUser(Integer userId, UserUpdateRequestDto request);

    UserDto updateUserFromMultipart(Integer userId, UserUpdateMultipartDto multipartDto) throws IOException;
}


