package com.musify.backend.repository;

import com.musify.backend.entity.UserArtistFollow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserArtistFollowRepository extends JpaRepository<UserArtistFollow, Long> {

    boolean existsByUserUserIdAndArtistArtistId(Long userId, Long artistId);

    Optional<UserArtistFollow> findByUserUserIdAndArtistArtistId(Long userId, Long artistId);

    List<UserArtistFollow> findAllByUserUserId(Long userId);
}
