package com.example.demo.controller;

import com.example.demo.model.TutionDetails;
import com.example.demo.service.TutionDetailsService;
import com.example.demo.whatsapp.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/schedules")
@CrossOrigin(origins = "*")
public class TutionDetailsController extends MongoEntityController<TutionDetails, String> {
    @Autowired
    protected WhatsAppService whatsAppService;
    @Autowired
    public TutionDetailsController(TutionDetailsService tutionDetailsService) {
        super(tutionDetailsService);  // Inject the ScheduleService into the parent class
    }
    @PostMapping("/send-whatsapp")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> payload) {
        try {
            String message = payload.get("message");
            String sid = whatsAppService.sendMessage(message);
            return ResponseEntity.ok(Map.of("success", true, "message", "Message sent with SID: " + sid));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error sending message: " + e.getMessage()));
        }
    }
}
