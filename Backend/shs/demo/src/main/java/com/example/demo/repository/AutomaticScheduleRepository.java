package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.AutomaticSchedule;

@Repository
    public interface AutomaticScheduleRepository extends MongoRepository<AutomaticSchedule, String> {
}
