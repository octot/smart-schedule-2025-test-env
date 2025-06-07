package com.example.demo.whatsapp;

import org.springframework.stereotype.Component;

@Component
public class TwilioConfig {
    private final String accountSid;
    private final String authToken;
    private final String fromNumber;
    private final String toNumber;

    public TwilioConfig() {
        this.accountSid = EnvUtil.get("TWILIO_ACCOUNT_SID");
        this.authToken = EnvUtil.get("TWILIO_AUTH_TOKEN");
        this.fromNumber = EnvUtil.get("TWILIO_FROM_NUMBER");
        this.toNumber = EnvUtil.get("TWILIO_TO_NUMBER");
    }

    public String getAccountSid() {
        return accountSid;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getFromNumber() {
        return fromNumber;
    }

    public String getToNumber() {
        return toNumber;
    }
}
