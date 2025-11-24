package com.musify.backend.repository;

import com.musify.backend.entity.UserTrackLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserTrackLikeRepository extends JpaRepository<UserTrackLike, Long> {

    boolean existsByUserUserIdAndTrackTrackId(Long userId, Long trackId);

    Optional<UserTrackLike> findByUserUserIdAndTrackTrackId(Long userId, Long trackId);

    List<UserTrackLike> findAllByUserUserId(Long userId);
}
