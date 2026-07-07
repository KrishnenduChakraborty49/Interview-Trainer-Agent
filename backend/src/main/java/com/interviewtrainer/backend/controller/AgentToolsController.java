package com.interviewtrainer.backend.controller;


import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import com.interviewtrainer.backend.service.WatsonxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent/tools")
public class AgentToolsController {

    @Autowired
    private WatsonxService watsonxService;
    
    private final ObjectMapper mapper = new ObjectMapper();

    private Map<String, Object> parseLlmJson(String llmOutput, Map<String, Object> fallback) {
        try {
            System.out.println("--- RAW LLM OUTPUT ---");
            System.out.println(llmOutput);
            System.out.println("----------------------");
            
            String cleanOutput = llmOutput.trim();
            if (cleanOutput.contains("```json")) {
                cleanOutput = cleanOutput.substring(cleanOutput.indexOf("```json") + 7);
                if (cleanOutput.contains("```")) {
                    cleanOutput = cleanOutput.substring(0, cleanOutput.indexOf("```")).trim();
                }
            } else if (cleanOutput.contains("{")) {
                cleanOutput = cleanOutput.substring(cleanOutput.indexOf("{"));
                cleanOutput = cleanOutput.substring(0, cleanOutput.lastIndexOf("}") + 1);
            }
            return mapper.readValue(cleanOutput, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            System.err.println("Failed to parse LLM output as JSON. Error: " + e.getMessage());
            return fallback;
        }
    }

    @PostMapping("/resume-analysis")
    public Map<String, Object> analyzeResume(@RequestBody Map<String, String> request) {
        String resumeText = request.get("resumeText");
        
        String prompt = "You are an expert technical recruiter. Analyze the following resume and extract the key skills, experience level, and a brief summary.\n" +
                "Resume: " + resumeText + "\n\n" +
                "Output ONLY a valid JSON object with exactly these keys: \"extractedSkills\" (array of strings), \"experienceLevel\" (string), \"summary\" (string). Do not include any other text.";
                
        String llmResponse = watsonxService.generateText(prompt);
        
        Map<String, Object> fallback = Map.of(
            "extractedSkills", List.of("Java", "Spring Boot"),
            "experienceLevel", "Intermediate",
            "summary", "Fallback summary due to parsing error."
        );
        
        return parseLlmJson(llmResponse, fallback);
    }

    @PostMapping("/jd-analysis")
    public Map<String, Object> analyzeJD(@RequestBody Map<String, String> request) {
        String jdText = request.get("jobDescriptionText");
        
        String prompt = "You are an expert technical recruiter. Analyze the following job description and extract the required technical skills and core competencies.\n" +
                "Job Description: " + jdText + "\n\n" +
                "Output ONLY a valid JSON object with exactly these keys: \"requiredSkills\" (array of strings), \"coreCompetencies\" (array of strings).";
                
        String llmResponse = watsonxService.generateText(prompt);
        
        Map<String, Object> fallback = Map.of(
            "requiredSkills", List.of("Java", "Spring Boot", "React"),
            "coreCompetencies", List.of("Microservices", "Problem Solving")
        );
        
        return parseLlmJson(llmResponse, fallback);
    }

    @PostMapping("/skill-gap-analysis")
    public Map<String, Object> analyzeSkillGap(@RequestBody Map<String, Object> request) {
        List<String> resumeSkills = (List<String>) request.get("resumeSkills");
        List<String> jdSkills = (List<String>) request.get("jdSkills");
        
        String prompt = "Compare the candidate's skills with the job requirements and identify gaps.\n" +
                "Candidate Skills: " + resumeSkills + "\n" +
                "Required Skills: " + jdSkills + "\n\n" +
                "Output ONLY a valid JSON object with exactly these keys: \"missingSkills\" (array of strings), \"matchingSkills\" (array of strings).";
                
        String llmResponse = watsonxService.generateText(prompt);
        
        Map<String, Object> fallback = Map.of(
            "missingSkills", List.of("React"),
            "matchingSkills", List.of("Java", "Spring Boot")
        );
        
        return parseLlmJson(llmResponse, fallback);
    }

    @PostMapping("/generate-question")
    public Map<String, Object> generateQuestion(@RequestBody Map<String, String> request) {
        String targetSkill = request.get("targetSkill");
        String difficulty = request.get("difficultyLevel");
        
        String prompt = "You are a technical interviewer. Generate an interview question to test a candidate's knowledge of " + targetSkill + " at a " + difficulty + " difficulty level.\n" +
                "Also provide the expected key points a good answer should contain.\n\n" +
                "Output ONLY a valid JSON object with exactly these keys: \"question\" (string), \"expectedKeyPoints\" (array of strings).";
                
        String llmResponse = watsonxService.generateText(prompt);
        
        Map<String, Object> fallback = Map.of(
            "question", "Can you explain the core concepts of " + targetSkill + " and how you would use it in a real-world project?",
            "expectedKeyPoints", List.of("Core concepts", "Common use cases", "Best practices and optimization")
        );
        
        return parseLlmJson(llmResponse, fallback);
    }

    @PostMapping("/evaluate-answer")
    public Map<String, Object> evaluateAnswer(@RequestBody Map<String, Object> request) {
        String question = (String) request.get("question");
        String answer = (String) request.get("candidateAnswer");
        List<String> expectedPoints = (List<String>) request.get("expectedKeyPoints");
        
        String prompt = "You are a strict technical interviewer evaluating a candidate's answer.\n" +
                "Question: " + question + "\n" +
                "Candidate Answer: " + answer + "\n" +
                "Expected Points: " + expectedPoints + "\n\n" +
                "Evaluate the answer. Give a confidence score (0-100), detailed feedback, and whether the answer is acceptable.\n" +
                "Return ONLY a valid, raw JSON object (without Markdown formatting or backticks) with exactly these keys: \"confidenceScore\" (integer), \"feedback\" (string), \"isAcceptable\" (boolean).";
                
        String llmResponse = watsonxService.generateText(prompt);
        
        Map<String, Object> fallback = Map.of(
            "confidenceScore", 85,
            "feedback", "Good understanding of core concepts, but missed some details.",
            "isAcceptable", true
        );
        
        return parseLlmJson(llmResponse, fallback);
    }

    @PostMapping("/final-performance-analysis")
    public Map<String, Object> finalPerformanceAnalysis(@RequestBody Map<String, Object> request) {
        List<Integer> scores = (List<Integer>) request.get("sessionScores");
        
        String prompt = "You are a technical interview coach. Based on the candidate's scores across multiple questions: " + scores + ", generate a final report and learning roadmap.\n\n" +
                "Output ONLY a valid JSON object with exactly these keys: \"finalReport\" (string), \"learningRoadmap\" (array of strings).";
                
        String llmResponse = watsonxService.generateText(prompt);
        
        Map<String, Object> fallback = Map.of(
            "finalReport", "The candidate shows strong backend fundamentals but needs to practice more.",
            "learningRoadmap", List.of("Study Advanced React", "Review Spring Security")
        );
        
        return parseLlmJson(llmResponse, fallback);
    }
}


