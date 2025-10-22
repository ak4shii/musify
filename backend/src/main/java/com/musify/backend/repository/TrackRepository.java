package com.musify.backend.repository;

import com.musify.backend.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackRepository extends JpaRepository<Track, Long> {
}
