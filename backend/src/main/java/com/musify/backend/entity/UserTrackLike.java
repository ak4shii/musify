package com.musify.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "usertracklike")
public class UserTrackLike {

    @EmbeddedId
    private UserTrackLikeId userTrackLikeId;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @MapsId("trackId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "liked_at")
    private Instant likedAt;

    @PrePersist
    public void prePersist() {
        if (likedAt == null) {
            likedAt = Instant.now();
        }
    }
}