package com.example.demo.model;

import lombok.Data;

import java.util.UUID;

@Data
public class DaySchedule {
    private String day;
    private String sessionStartTime;
    private String sessionEndTime;
    private boolean daySchedule;
    private String automaticScheduleTime;
    private UUID perDayScheduleUid = UUID.randomUUID(); // Generate UUID automatically

}
