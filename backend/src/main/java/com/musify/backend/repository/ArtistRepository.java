package com.musify.backend.repository;

import com.musify.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Integer> {

    List<Artist> findTop10ByOrderByPopularityDesc();

    @Query("""
           SELECT a FROM Artist a
           WHERE LOWER(a.artistName) LIKE LOWER(CONCAT('%', :query, '%'))
           ORDER BY a.popularity DESC
           """)
    List<Artist> findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(String query, Pageable pageable);
}
