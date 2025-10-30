package com.eventapp.service;

import com.eventapp.model.Event;
import com.eventapp.model.Registration;
import com.eventapp.model.User;
import com.eventapp.repository.EventRepository;
import com.eventapp.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    public Event createEvent(String title, String description, LocalDateTime eventDateTime,
                            String location, Boolean isOnline, User host) {
        String eventCode = generateUniqueEventCode();
        Event event = new Event(title, description, eventCode, host, 
                               eventDateTime, location, isOnline);
        return eventRepository.save(event);
    }
    
    private String generateUniqueEventCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        String code;
        
        do {
            StringBuilder sb = new StringBuilder("EVT-");
            for (int i = 0; i < 4; i++) {
                sb.append(characters.charAt(random.nextInt(characters.length())));
            }
            code = sb.toString();
        } while (eventRepository.findByEventCode(code).isPresent());
        
        return code;
    }
    
    public Event registerForEvent(String eventCode, User user) throws Exception {
        Optional<Event> eventOpt = eventRepository.findByEventCode(eventCode);
        
        if (eventOpt.isEmpty()) {
            throw new Exception("Invalid event code");
        }
        
        Event event = eventOpt.get();
        
        if (event.getHost().getId().equals(user.getId())) {
            throw new Exception("You cannot register for your own event");
        }
        
        if (registrationRepository.existsByUserAndEvent(user, event)) {
            throw new Exception("You are already registered for this event");
        }
        
        Registration registration = new Registration(user, event);
        registrationRepository.save(registration);
        
        return event;
    }
    
    public List<Event> getHostedEvents(User host) {
        return eventRepository.findByHost(host);
    }
    
    public List<Event> getAttendingEvents(User user) {
        List<Registration> registrations = registrationRepository.findByUser(user);
        return registrations.stream()
                .map(Registration::getEvent)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteEvent(Long eventId) throws Exception {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        
        if (eventOpt.isEmpty()) {
            throw new Exception("Event not found");
        }
        
        Event event = eventOpt.get();
        
        // Delete all registrations for this event first
        List<Registration> registrations = registrationRepository.findByEvent(event);
        registrationRepository.deleteAll(registrations);
        
        // Delete the event
        eventRepository.delete(event);
    }
    
    public List<Map<String, Object>> getEventAttendees(Long eventId) throws Exception {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        
        if (eventOpt.isEmpty()) {
            throw new Exception("Event not found");
        }
        
        Event event = eventOpt.get();
        List<Registration> registrations = registrationRepository.findByEvent(event);
        
        return registrations.stream()
                .map(registration -> {
                    Map<String, Object> attendeeInfo = new HashMap<>();
                    User user = registration.getUser();
                    attendeeInfo.put("name", user.getName());
                    attendeeInfo.put("email", user.getEmail());
                    attendeeInfo.put("registeredAt", registration.getRegisteredAt());
                    return attendeeInfo;
                })
                .collect(Collectors.toList());
    }
}