package com.musify.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.Duration;

@Getter
@Setter
@Entity
@Table(name = "track")
public class Track extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "track_id", nullable = false)
    private Integer trackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "album_id")
    private Album album;

    @Size(max = 200)
    @NotNull
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @NotNull
    @Column(name = "file_path", nullable = false, length = Integer.MAX_VALUE)
    private String filePath;

    @Column(name = "cover_url", length = Integer.MAX_VALUE)
    private String coverUrl;

    @Size(max = 100)
    @Column(name = "genre", length = 100)
    private String genre;
    @ColumnDefault("0")
    @Column(name = "popularity")
    private Integer popularity;

    @Column(name = "duration", columnDefinition = "interval")
    private String duration;
}