package com.example.demo.whatsapp;

import com.example.demo.EnvUtil;
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
        Twilio.init(EnvUtil.get(config.getAccountSid()), EnvUtil.get(config.getAuthToken()));
    }

    public String sendMessage(String body) {
        Message message = Message.creator(
                new PhoneNumber(EnvUtil.get(config.getToNumber())),
                new PhoneNumber(EnvUtil.get(config.getFromNumber())),
                body
        ).create();
        System.out.println("Sent sendMessage with sid" + message.getSid());
        return message.getSid();
    }
}
