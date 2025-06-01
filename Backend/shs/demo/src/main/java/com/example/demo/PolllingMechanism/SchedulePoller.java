package com.example.demo.PolllingMechanism;

import com.example.demo.model.FlattenedSchedule;
import com.example.demo.repository.FlattenedScheduleRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class SchedulePoller {

    private final FlattenedScheduleRepository flattenedScheduleRepository;

    @Autowired
    public SchedulePoller(FlattenedScheduleRepository flattenedScheduleRepository) {
        this.flattenedScheduleRepository = flattenedScheduleRepository;
    }

    //Improves comparsion by O(1) than equals which takes 0(n)
    private String computeHash(Map<String, List<JsonNode>> data) throws JsonProcessingException, NoSuchAlgorithmException {
        String json = objectMapper.writeValueAsString(data); // Convert to consistent JSON
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(json.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hashBytes);
    }

    private String previousHash = null;
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void startPolling() {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                Map<String, List<JsonNode>> currentData = fetchFromApi();
                String currentHash = computeHash(currentData);
                if (!currentHash.equals(previousHash)) {
                    previousHash = currentHash;
                    handleUpdatedSchedule(currentData);
                } else {
                    System.out.println("No changes detected.");
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 0, 100, TimeUnit.SECONDS);
    }

    public static Map<String, List<JsonNode>> flattenSchedulesGroupedByTutor(String inputJsonArray) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode arrayNode = mapper.readTree(inputJsonArray);

        if (!arrayNode.isArray()) {
            throw new IllegalArgumentException("Input JSON must be an array.");
        }

        Map<String, List<JsonNode>> result = new HashMap<>();

        for (JsonNode tutorNode : arrayNode) {
            String id = tutorNode.path("id").asText();
            String tuitionId = tutorNode.path("tuitionId").asText();
            String tutorName = tutorNode.path("tutorName").asText();
            String key = tutorName + tuitionId;

            JsonNode detailsArray = tutorNode.path("automaticScheduleDetails");
            if (!detailsArray.isArray()) continue;

            for (JsonNode detail : detailsArray) {
                ObjectNode flatNode = detail.deepCopy();
                flatNode.put("id", id);
                flatNode.put("tuitionId", tuitionId);
                flatNode.put("tutorName", tutorName);
                result.computeIfAbsent(key, k -> new ArrayList<>()).add(flatNode);
            }
        }
        return result;
    }

    private Map<String, List<JsonNode>> fetchFromApi() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/automatic-schedules"))
                .GET()
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to fetch data: " + response.body());
        }
        Map<String, List<JsonNode>> result = flattenSchedulesGroupedByTutor(response.body());
        return result;
    }

    private FlattenedSchedule mapToFlattenedSchedule(JsonNode node, String key) {
        FlattenedSchedule schedule = new FlattenedSchedule();
        schedule.setId(node.path("id").asText());
        schedule.setPerDayScheduleUid(node.path("perDayScheduleUid").asText());
        schedule.setTuitionId(node.path("tuitionId").asText());
        schedule.setTutorName(node.path("tutorName").asText());
        schedule.setDay(node.path("day").asText());
        schedule.setSessionStartTime(node.path("sessionStartTime").asText());
        schedule.setAutomaticScheduleTime(node.path("automaticScheduleTime").asText());
        schedule.setSessionEndTime(node.path("sessionEndTime").asText());
        schedule.setKey(key);
        String uniqueId = schedule.getTutorName() + "_" + schedule.getTuitionId() + "_" + schedule.getDay();
        schedule.setUniqueId(uniqueId);
        return schedule;
    }

    private void handleUpdatedSchedule(Map<String, List<JsonNode>> updatedSchedule) {
        for (Map.Entry<String, List<JsonNode>> entry : updatedSchedule.entrySet()) {
            String key = entry.getKey();
            for (JsonNode node : entry.getValue()) {
                FlattenedSchedule schedule = mapToFlattenedSchedule(node, key);
                if (flattenedScheduleRepository != null) {
                    flattenedScheduleRepository.save(schedule);
                }
            }
        }
    }
}
