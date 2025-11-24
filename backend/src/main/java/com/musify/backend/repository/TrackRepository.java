package com.musify.backend.repository;

import com.musify.backend.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrackRepository extends JpaRepository<Track, Long> {

    List<Track> findTop10ByOrderByPopularityDesc();

    @Query("""
           SELECT t FROM Track t
           WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%'))
           ORDER BY t.popularity DESC
           """)
    List<Track> findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(String query, Pageable pageable);

    @Query("SELECT t FROM Track t WHERE t.album.albumId = :albumId")
    List<Track> findTracksByAlbumId(@Param("albumId") Long albumId);

}
