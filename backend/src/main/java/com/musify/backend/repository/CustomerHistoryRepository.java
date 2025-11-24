package com.musify.backend.repository;

import com.musify.backend.entity.CustomerHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerHistoryRepository extends JpaRepository<CustomerHistory, Long> {

    List<CustomerHistory> findAllByUserUserIdOrderByPlayedAtDesc(Long userId);
}
