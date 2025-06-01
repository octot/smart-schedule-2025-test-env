package com.example.demo.service;

import com.example.demo.model.AutomaticSchedule;
import com.example.demo.repository.AutomaticScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AutomaticScheduleService  extends MongoEntityService<AutomaticSchedule, String>{
    @Autowired
    public AutomaticScheduleService(AutomaticScheduleRepository automaticScheduleRepository) {
        super(automaticScheduleRepository);
    }
}
