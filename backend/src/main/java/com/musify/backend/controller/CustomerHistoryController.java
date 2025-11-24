package com.musify.backend.controller;

import com.musify.backend.dto.TrackDto;
import com.musify.backend.service.ICustomerHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class CustomerHistoryController {

    private final ICustomerHistoryService iCustomerHistoryService;

    @PostMapping("/{userId}/play/{trackId}")
    public ResponseEntity<String> saveHistory(@PathVariable Long userId, @PathVariable Long trackId) {
        iCustomerHistoryService.saveListeningHistory(userId, trackId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Customer history saved successfully");
    }

    @GetMapping("/{userId}/listening-history")
    public ResponseEntity<?> getHistory(@PathVariable Long userId) {
        List<TrackDto> tracks = iCustomerHistoryService.getListeningHistory(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(tracks);
    }
}
