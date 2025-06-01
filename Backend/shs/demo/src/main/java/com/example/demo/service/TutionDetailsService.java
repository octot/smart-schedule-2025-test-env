package com.example.demo.service;

import com.example.demo.model.TutionDetails;
import com.example.demo.repository.TutionDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TutionDetailsService extends MongoEntityService<TutionDetails, String>{
    @Autowired
    public TutionDetailsService(TutionDetailsRepository tutionDetailsRepository) {
        super(tutionDetailsRepository);
    }
}
