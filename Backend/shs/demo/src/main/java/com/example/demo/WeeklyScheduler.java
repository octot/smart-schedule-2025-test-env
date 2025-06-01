package com.example.demo;

import com.example.demo.whatsapp.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.concurrent.*;
import java.util.logging.*;
@Component
public class WeeklyScheduler {
    @Autowired
    private WhatsAppService whatsAppService;
    private static final Logger logger = Logger.getLogger(WeeklyScheduler.class.getName());
    private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private String formatDuration(long millis) {
        long seconds = millis / 1000;
        long days = seconds / (24 * 3600);
        seconds %= (24 * 3600);
        long hours = seconds / 3600;
        seconds %= 3600;
        long minutes = seconds / 60;
        seconds %= 60;

        return String.format("%d days, %02d hours, %02d minutes, %02d seconds", days, hours, minutes, seconds);
    }

    public void scheduleTasks(List<Map<String, Object>> scheduleDetails) {
        for (Map<String, Object> scheduleItem : scheduleDetails) {
            String day = (String) scheduleItem.get("day");
            String automaticScheduleTime = (String) scheduleItem.get("automaticScheduleTime");
            DayOfWeek dayOfWeek = getDayOfWeekFromString(day);
            LocalTime scheduleTime = LocalTime.parse(automaticScheduleTime);
            long delayInMillis = calculateDelayUntilNextOccurrence(dayOfWeek, scheduleTime);
            System.out.println("delayInMillis"+delayInMillis);
            int ConstantDelayInMillis=10000;
            scheduler.schedule(() -> sendMessage(scheduleItem), ConstantDelayInMillis, TimeUnit.MILLISECONDS);
        }
    }

    private DayOfWeek getDayOfWeekFromString(String dayString) {
        switch (dayString.toLowerCase()) {
            case "monday":
                return DayOfWeek.MONDAY;
            case "tuesday":
                return DayOfWeek.TUESDAY;
            case "wednesday":
                return DayOfWeek.WEDNESDAY;
            case "thursday":
                return DayOfWeek.THURSDAY;
            case "friday":
                return DayOfWeek.FRIDAY;
            case "saturday":
                return DayOfWeek.SATURDAY;
            case "sunday":
                return DayOfWeek.SUNDAY;
            default:
                throw new IllegalArgumentException("Invalid day: " + dayString);
        }
    }

    private long calculateDelayUntilNextOccurrence(DayOfWeek dayOfWeek, LocalTime time) {
        // Get the current date and time
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextOccurrence = now.with(TemporalAdjusters.nextOrSame(dayOfWeek)).withHour(time.getHour())
                .withMinute(time.getMinute()).withSecond(time.getSecond()).withNano(time.getNano());
        if (nextOccurrence.isBefore(now)) {
            nextOccurrence = nextOccurrence.plusWeeks(1);
        }
        long delayMillis = Duration.between(now, nextOccurrence).toMillis();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a");
        System.out.println("Next scheduled run at: " + nextOccurrence.format(formatter));
        System.out.println("Delay (ms): " + delayMillis);
        return delayMillis;
    }

    private void sendMessage(Map<String, Object> scheduleItem) {

        // Prepare the message based on the schedule data
        String tuitionId = (String) scheduleItem.get("tuitionId");
        String tutorName = (String) scheduleItem.get("tutorName");
        String sessionStartTime = (String) scheduleItem.get("sessionStartTime");
        String sessionEndTime = (String) scheduleItem.get("sessionEndTime");

        String message = String.format(new StringBuilder().append("Greetings from Smartpoint 😇\n").append("Today your class is scheduled for:\n").append("Tuition ID : %s\n").append("Session Date : %s\n").append("Tutor Name : %s\n").append("Time of Session: %s - %s").toString(),
                tuitionId,
                LocalDate.now(), // Use the correct session date
                tutorName,
                sessionStartTime,
                sessionEndTime);
                String sid = whatsAppService.sendMessage(message);
        System.out.println("Sent WhatsApp Message with SID: " + sid);
    }

    public void shutdown() {
        scheduler.shutdown();
    }

}
