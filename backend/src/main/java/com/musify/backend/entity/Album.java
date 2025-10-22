package com.musify.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "album")
public class Album extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "album_id", nullable = false)
    private Integer albumId;

    @Size(max = 200)
    @NotNull
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "cover_url", length = Integer.MAX_VALUE)
    private String coverUrl;

    @Column(name = "release_date")
    private LocalDate releaseDate;
}