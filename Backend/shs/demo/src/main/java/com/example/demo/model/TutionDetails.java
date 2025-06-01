package com.example.demo.model;

import lombok.Data;

import java.util.List;
import java.util.Map;
@Data
public class TutionDetails {
    private String id;
    private String tuitionId;
    private String tutorName;
    private boolean automate = false;
    private List<DaySchedule> totalDays;
    private CommonSession commonSession;
    private String sessionDate;
    private boolean useCommonSession;
    private Map<String, Boolean> selectedDays;

}
