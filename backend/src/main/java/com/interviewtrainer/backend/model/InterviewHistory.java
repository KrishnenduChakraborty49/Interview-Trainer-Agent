package com.interviewtrainer.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_history")
public class InterviewHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String targetSkill;
    private int score;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private LocalDateTime sessionDate;

    public InterviewHistory() {
        this.sessionDate = LocalDateTime.now();
    }

    public InterviewHistory(User user, String targetSkill, int score, String feedback) {
        this.user = user;
        this.targetSkill = targetSkill;
        this.score = score;
        this.feedback = feedback;
        this.sessionDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTargetSkill() { return targetSkill; }
    public void setTargetSkill(String targetSkill) { this.targetSkill = targetSkill; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDateTime sessionDate) { this.sessionDate = sessionDate; }
}
