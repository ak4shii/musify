package com.musify.backend.controller;

import com.musify.backend.dto.UserDto;
import com.musify.backend.dto.UserUpdateMultipartDto;
import com.musify.backend.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService iUserService;

    @PutMapping(value = "/{userId}", consumes = {"multipart/form-data"})
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Integer userId,
            @Valid @ModelAttribute UserUpdateMultipartDto multipartDto) throws  IOException {
        UserDto updatedUser = iUserService.updateUserFromMultipart(userId, multipartDto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
    }
}


