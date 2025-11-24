package com.musify.backend.repository;

import com.musify.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    List<Artist> findTop10ByOrderByPopularityDesc();

    @Query("""
           SELECT a FROM Artist a
           WHERE LOWER(a.artistName) LIKE LOWER(CONCAT('%', :query, '%'))
           ORDER BY a.popularity DESC
           """)
    List<Artist> findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(String query, Pageable pageable);

    Optional<Artist> findById(Long artistId);
}
