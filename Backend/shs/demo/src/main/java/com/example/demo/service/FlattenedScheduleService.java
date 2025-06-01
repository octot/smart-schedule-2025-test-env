package com.example.demo.service;

import com.example.demo.model.FlattenedSchedule;
import com.example.demo.repository.FlattenedScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FlattenedScheduleService extends MongoEntityService<FlattenedSchedule, String> {

    @Autowired
    public FlattenedScheduleService(FlattenedScheduleRepository repository) {
        super(repository);
    }

    // Add any FlattenedSchedule-specific methods here if needed
}
