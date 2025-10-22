package com.musify.backend.service.impl;

import com.musify.backend.dto.AlbumDto;
import com.musify.backend.entity.Album;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.service.IAlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements IAlbumService {

    private final AlbumRepository albumRepository;

    @Override
    public List<AlbumDto> getAlbums() {
        return albumRepository.findAll().stream()
                .map(this::transformToDto).collect(Collectors.toList());
    }

    AlbumDto transformToDto(Album album) {
        AlbumDto albumDto = new AlbumDto();
        BeanUtils.copyProperties(album, albumDto);
        return albumDto;
    }
}
