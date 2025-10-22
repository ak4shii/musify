package com.musify.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class UserArtistFollowId implements Serializable {

    private static final long serialVersionUID = -2536755372559037080L;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @NotNull
    @Column(name = "artist_id", nullable = false)
    private Integer artistId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UserArtistFollowId entity = (UserArtistFollowId) o;
        return Objects.equals(this.artistId, entity.artistId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(artistId, userId);
    }
}