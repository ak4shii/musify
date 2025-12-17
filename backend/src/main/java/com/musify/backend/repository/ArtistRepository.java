package com.musify.backend.repository;

import com.musify.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    List<Artist> findTop10ByOrderByFollowersDesc();

    @Query("""
           SELECT a FROM Artist a
           WHERE LOWER(a.artistName) LIKE LOWER(CONCAT('%', :query, '%'))
           ORDER BY a.followers DESC
           """)
    List<Artist> findTopByTitleContainingIgnoreCaseOrderByFollowersDesc(String query, Pageable pageable);
    
    @Query("""
           SELECT COUNT(uaf) FROM UserArtistFollow uaf
           WHERE uaf.artist.artistId = :artistId
           """)
    Long countFollowersByArtistId(@Param("artistId") Long artistId);

    Optional<Artist> findById(Long artistId);
}
