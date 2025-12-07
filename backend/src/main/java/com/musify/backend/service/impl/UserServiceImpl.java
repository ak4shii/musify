package com.musify.backend.service.impl;

import com.musify.backend.dto.UserDto;
import com.musify.backend.dto.UserEnableRequestDto;
import com.musify.backend.entity.User;
import com.musify.backend.exception.ResourceNotFoundException;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

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

    private UserDto transformToDto(User user) {
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);
        return userDto;
    }
}


