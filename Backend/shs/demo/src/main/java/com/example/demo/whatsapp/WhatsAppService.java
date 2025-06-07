package com.example.demo.whatsapp;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {
    private final TwilioConfig config;

    @Autowired
    public WhatsAppService(TwilioConfig config) {
        this.config = config;
        Twilio.init(config.getAccountSid(), config.getAuthToken());
    }

    public String sendMessage(String body) {
        Message message = Message.creator(
                new PhoneNumber(config.getToNumber()),
                new PhoneNumber(config.getFromNumber()),
                body
        ).create();
        return message.getSid();
    }
}
