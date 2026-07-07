package com.interviewtrainer.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WatsonxService {

    @Value("${ibm.cloud.api-key}")
    private String apiKey;

    @Value("${ibm.watsonx.project-id}")
    private String projectId;

    @Value("${ibm.watsonx.url}")
    private String watsonxUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private String iamToken = null;
    private long tokenExpiry = 0;

    private String getIamToken() {
        if (iamToken != null && System.currentTimeMillis() < tokenExpiry) {
            return iamToken;
        }

        String iamUrl = "https://iam.cloud.ibm.com/identity/token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
        map.add("apikey", apiKey);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(iamUrl, request, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("access_token")) {
                this.iamToken = (String) body.get("access_token");
                Integer expiresIn = (Integer) body.get("expires_in");
                this.tokenExpiry = System.currentTimeMillis() + (expiresIn * 1000L) - 60000L; // buffer
                return this.iamToken;
            }
        } catch (Exception e) {
            System.err.println("Failed to get IAM token: " + e.getMessage());
        }
        return null;
    }

    public String generateText(String prompt) {
        String token = getIamToken();
        if (token == null) {
            return "Error: Could not authenticate with IBM Cloud.";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(token);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model_id", "ibm/granite-3-8b-instruct");
        requestBody.put("project_id", projectId);
        
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("max_new_tokens", 500);
        parameters.put("temperature", 0.7);
        requestBody.put("parameters", parameters);
        requestBody.put("input", prompt);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(watsonxUrl, request, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");
                if (!results.isEmpty()) {
                    return (String) results.get(0).get("generated_text");
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to generate text from Watsonx: " + e.getMessage());
        }
        return "Error: Failed to generate response from LLM.";
    }
}
