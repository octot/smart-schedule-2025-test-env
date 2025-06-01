package com.example.demo.controller;

import com.example.demo.model.FlattenedSchedule;
import com.example.demo.service.FlattenedScheduleService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/flattened-schedules")
public class FlattenedScheduleController extends MongoEntityController<FlattenedSchedule, String> {

    public FlattenedScheduleController(FlattenedScheduleService flattenedScheduleService) {
        super(flattenedScheduleService);
    }
}
