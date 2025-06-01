package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "flattened_schedules")
public class FlattenedSchedule {

    @Id
    private String uniqueId;  // Custom ID to avoid duplicates (e.g., tutorName_day_time or a UUID)

    private String id;                      // Original schedule ID (from "id" in image)
    private String tuitionId;
    private String tutorName;

    private String day;
    private String sessionStartTime;
    private String sessionEndTime;
    private boolean daySchedule;
    private String automaticScheduleTime;
    private String perDayScheduleUid;
    private String key;                    // tutorName + tuitionId (used as grouping key)
}
