package com.interviewtrainer.backend.repository;

import com.interviewtrainer.backend.model.InterviewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewHistoryRepository extends JpaRepository<InterviewHistory, Long> {
    List<InterviewHistory> findByUserIdOrderBySessionDateDesc(Long userId);
}
