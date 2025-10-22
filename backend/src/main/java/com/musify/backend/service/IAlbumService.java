package com.musify.backend.service;

import com.musify.backend.dto.AlbumDto;

import java.util.List;

public interface IAlbumService {

    List<AlbumDto> getAlbums();
}
