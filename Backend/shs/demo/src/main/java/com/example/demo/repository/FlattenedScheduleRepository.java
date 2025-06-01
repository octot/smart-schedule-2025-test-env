package com.example.demo.repository;

import com.example.demo.model.FlattenedSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlattenedScheduleRepository extends MongoRepository<FlattenedSchedule, String> {
}
