package com.interviewtrainer.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent/tools")
public class AgentToolsController {

    @PostMapping("/resume-analysis")
    public Map<String, Object> analyzeResume(@RequestBody Map<String, String> request) {
        return Map.of(
            "extractedSkills", List.of("Java", "Spring Boot", "React"),
            "experienceLevel", "Intermediate",
            "summary", "Strong backend developer with AI skills."
        );
    }

    @PostMapping("/jd-analysis")
    public Map<String, Object> analyzeJD(@RequestBody Map<String, String> request) {
        return Map.of(
            "requiredSkills", List.of("Java", "Spring Boot", "AWS"),
            "coreCompetencies", List.of("Backend Development", "System Design")
        );
    }

    @PostMapping("/skill-gap-analysis")
    public Map<String, Object> analyzeSkillGap(@RequestBody Map<String, List<String>> request) {
        return Map.of(
            "missingSkills", List.of("AWS"),
            "matchingSkills", List.of("Java", "Spring Boot")
        );
    }

    @PostMapping("/generate-question")
    public Map<String, Object> generateQuestion(@RequestBody Map<String, String> request) {
        return Map.of(
            "question", "Can you explain how you would deploy a Spring Boot application to AWS?",
            "expectedKeyPoints", List.of("EC2/ECS", "RDS for DB", "Elastic Beanstalk")
        );
    }

    @PostMapping("/evaluate-answer")
    public Map<String, Object> evaluateAnswer(@RequestBody Map<String, Object> request) {
        return Map.of(
            "confidenceScore", 85,
            "feedback", "Good understanding of AWS deployment, but could mention CI/CD pipelines.",
            "isAcceptable", true
        );
    }

    @PostMapping("/final-performance-analysis")
    public Map<String, Object> finalPerformanceAnalysis(@RequestBody Map<String, Object> request) {
        return Map.of(
            "finalReport", "The candidate performed well, particularly in Java. Need to improve cloud deployment knowledge.",
            "learningRoadmap", List.of("Study AWS fundamentals", "Practice CI/CD with GitHub Actions")
        );
    }
}
