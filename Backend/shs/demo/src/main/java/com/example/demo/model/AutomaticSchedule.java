package com.example.demo.model;

import lombok.Data;

import java.util.List;

@Data
public class AutomaticSchedule {
    private List<DaySchedule> automaticScheduleDetails;
    private String id;
    private String tuitionId;
    private String tutorName;
}
