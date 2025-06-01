package com.example.demo.repository;

import com.example.demo.model.TutionDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TutionDetailsRepository extends MongoRepository<TutionDetails, String> {

}
