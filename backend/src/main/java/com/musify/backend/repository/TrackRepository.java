package com.musify.backend.repository;

import com.musify.backend.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long> {

    List<Track> findTop10ByOrderByPopularityDesc();

    @Query("""
           SELECT t FROM Track t
           WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%'))
           ORDER BY t.popularity DESC
           """)
    List<Track> findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(String query, Pageable pageable);
}
