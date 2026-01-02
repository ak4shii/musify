package com.musify.backend.service.impl;

import com.musify.backend.dto.UserDto;
import com.musify.backend.dto.UserEnableRequestDto;
import com.musify.backend.dto.UserUpdateMultipartDto;
import com.musify.backend.dto.UserUpdateRequestDto;
import com.musify.backend.entity.User;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.IUserService;
import com.musify.backend.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::transformToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserDto> getUserById(Integer userId) {
        return userRepository.findById(userId.longValue())
                .map(this::transformToDto);
    }

    @Override
    @Transactional
    public UserDto updateUserEnabledStatus(Integer userId, UserEnableRequestDto request) {
        User user = userRepository.findById(userId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        user.setEnabled(request.getEnabled());

        User updatedUser = userRepository.save(user);
        return transformToDto(updatedUser);
    }

    @Override
    @Transactional
    public UserDto updateUser(Integer userId, UserUpdateRequestDto request) {
        User user = userRepository.findById(userId.longValue())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        if (request.getUserName() != null) {
            user.setUserName(request.getUserName());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getProfileUrl() != null) {
            user.setProfileUrl(request.getProfileUrl());
        }

        User updatedUser = userRepository.save(user);
        return transformToDto(updatedUser);
    }

    @Override
    @Transactional
    public UserDto updateUserFromMultipart(Integer userId, UserUpdateMultipartDto multipartDto) throws IOException {
        UserUpdateRequestDto request = new UserUpdateRequestDto();

        if (multipartDto.getUserName() != null) {
            request.setUserName(multipartDto.getUserName());
        }

        if (multipartDto.getDateOfBirth() != null) {
            request.setDateOfBirth(java.time.LocalDate.parse(multipartDto.getDateOfBirth()));
        }

        if (multipartDto.getProfileImage() != null && !multipartDto.getProfileImage().isEmpty()) {
            String profilePath = fileStorageService.uploadUserProfileImageToUploads(multipartDto.getProfileImage(), userId);
            request.setProfileUrl(profilePath);
        }

        return updateUser(userId, request);
    }

    private UserDto transformToDto(User user) {
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);
        return userDto;
    }
}


