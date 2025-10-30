package com.eventapp.controller;

import com.eventapp.model.Event;
import com.eventapp.model.User;
import com.eventapp.service.EventService;
import com.eventapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String title = (String) payload.get("title");
            String description = (String) payload.get("description");
            String eventDateTimeStr = (String) payload.get("eventDateTime");
            Boolean isOnline = (Boolean) payload.get("isOnline");
            String location = (String) payload.get("location");
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // Parse the datetime
            LocalDateTime eventDateTime = LocalDateTime.parse(eventDateTimeStr);
            
            // Validate location if not online
            if (!isOnline && (location == null || location.trim().isEmpty())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Location is required for in-person events"));
            }
            
            Event event = eventService.createEvent(title, description, eventDateTime, 
                                                   location, isOnline, userOpt.get());
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to create event: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String eventCode = (String) payload.get("eventCode");
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            Event event = eventService.registerForEvent(eventCode, userOpt.get());
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/hosted/{userId}")
    public ResponseEntity<?> getHostedEvents(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            List<Event> events = eventService.getHostedEvents(userOpt.get());
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve hosted events"));
        }
    }
    
    @GetMapping("/attending/{userId}")
    public ResponseEntity<?> getAttendingEvents(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            List<Event> events = eventService.getAttendingEvents(userOpt.get());
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve attending events"));
        }
    }
    
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        try {
            eventService.deleteEvent(eventId);
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{eventId}/attendees")
    public ResponseEntity<?> getEventAttendees(@PathVariable Long eventId) {
        try {
            List<Map<String, Object>> attendees = eventService.getEventAttendees(eventId);
            return ResponseEntity.ok(attendees);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve attendees: " + e.getMessage()));
        }
    }
}