package com.example.demo.controller;

import com.example.demo.model.AutomaticSchedule;
import com.example.demo.service.AutomaticScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/automatic-schedules")
@CrossOrigin(origins = "*")
public class AutomaticScheduleController extends MongoEntityController<AutomaticSchedule, String> {

    @Autowired
    public AutomaticScheduleController( AutomaticScheduleService automaticScheduleService) {
        super(automaticScheduleService);
    }

    @PostMapping("/bulk-upload-schedules")
    public ResponseEntity<List<AutomaticSchedule>> create(@RequestBody List<AutomaticSchedule> automaticSchedule) {
            List<AutomaticSchedule> created = new ArrayList<>();
        for (AutomaticSchedule schedule : automaticSchedule) {
            created.add(service.create(schedule));
        }
        return ResponseEntity.ok(created);
    }

}
