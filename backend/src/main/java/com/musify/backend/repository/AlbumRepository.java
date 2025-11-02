package com.musify.backend.repository;

import com.musify.backend.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Integer> {

    List<Album> findTop10ByOrderByPopularityDesc();

    @Query("""
           SELECT a FROM Album a
           WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%'))
           ORDER BY a.popularity DESC
           """)
    List<Album> findTopByTitleContainingIgnoreCaseOrderByPopularityDesc(String query, Pageable pageable);
}
