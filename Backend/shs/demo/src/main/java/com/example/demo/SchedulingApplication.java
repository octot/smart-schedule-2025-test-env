package com.example.demo;

import com.example.demo.PolllingMechanism.SchedulePoller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;

import java.util.List;
import java.util.Map;

@SpringBootApplication
//public class SchedulingApplication implements CommandLineRunner
public class SchedulingApplication {
    @Autowired
    private static SchedulePoller schedulePoller;

    @Autowired
    public SchedulingApplication(SchedulePoller schedulePoller) {
        this.schedulePoller = schedulePoller;
    }


    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(SchedulingApplication.class, args);
        WeeklyScheduler weeklyScheduler = context.getBean(WeeklyScheduler.class);
        List<Map<String, Object>> scheduleDetails = List.of(
                Map.of(
                        "day", "Monday",
                        "automaticScheduleTime", "19:29",
                        "sessionStartTime", "09:00 AM",
                        "sessionEndTime", "10:00 AM",
                        "tuitionId", "T001",
                        "tutorName", "Ajay Kumar",
                        "perDayScheduleUid", "52874e24-cd52-47ce-9f85-3979bdee5f9c"
                ),
                Map.of(
                        "day", "Tuesday",
                        "automaticScheduleTime", "21:08",
                        "sessionStartTime", "09:00 AM",
                        "sessionEndTime", "15:00 AM",
                        "tuitionId", "T001",
                        "tutorName", "Ajay Kumar",
                        "perDayScheduleUid", "4df45de3-1960-4bdd-a6e9-c1341af368aa"
                )
        );
//        weeklyScheduler.scheduleTasks(scheduleDetails);
    }
    /*
    @Override
    public void run(String... args) {
        schedulePoller.startPolling(); // Now it's Spring-managed
    }
    */

}
