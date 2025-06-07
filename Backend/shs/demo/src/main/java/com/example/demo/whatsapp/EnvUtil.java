package com.example.demo.whatsapp;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvUtil {
    private static final Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .directory("./")  // force root directory
            .load();

    /**
     * Tries to load a value from system environment variables first,
     * falls back to .env file if not found.
     */
    public static String get(String key) {
        String value = System.getenv(key);
        if (value == null || value.isEmpty()) {
            value = dotenv.get(key);
        }
        if (value == null || value.isEmpty()) {
            throw new IllegalStateException("Missing required environment variable: " + "key" + key + "value" + value);
        }
        return value;
    }

    /**
     * Get value with default fallback.
     */
    public static String get(String key, String defaultValue) {
        String value = null;
        try {
            value = get(key);
        } catch (IllegalStateException e) {
            System.out.println("Using default for missing key '" + key + "'");
        }
        return (value != null) ? value : defaultValue;
    }
}

