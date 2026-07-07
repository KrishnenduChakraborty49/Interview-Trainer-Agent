package com.interviewtrainer.backend.controller;

import com.interviewtrainer.backend.model.InterviewHistory;
import com.interviewtrainer.backend.model.User;
import com.interviewtrainer.backend.repository.InterviewHistoryRepository;
import com.interviewtrainer.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private InterviewHistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getHistory() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        
        List<InterviewHistory> history = historyRepository.findByUserIdOrderBySessionDateDesc(user.getId());
        
        List<Map<String, Object>> response = history.stream().map(h -> Map.<String, Object>of(
            "id", h.getId(),
            "targetSkill", h.getTargetSkill(),
            "score", h.getScore(),
            "feedback", h.getFeedback(),
            "date", h.getSessionDate().toString()
        )).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> saveHistory(@RequestBody Map<String, Object> request) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        
        String targetSkill = (String) request.get("targetSkill");
        int score = (Integer) request.get("score");
        String feedback = (String) request.get("feedback");
        
        InterviewHistory history = new InterviewHistory(user, targetSkill, score, feedback);
        historyRepository.save(history);
        
        return ResponseEntity.ok(Map.of("message", "History saved successfully", "id", history.getId()));
    }
}
