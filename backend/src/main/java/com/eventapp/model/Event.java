package com.eventapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "event_code", nullable = false, unique = true)
    private String eventCode;
    
    @ManyToOne
    @JoinColumn(name = "host_id", nullable = false)
    private User host;
    
    @Column(name = "event_date_time", nullable = false)
    private LocalDateTime eventDateTime;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "is_online", nullable = false)
    private Boolean isOnline;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public Event() {
        this.createdAt = LocalDateTime.now();
        this.isOnline = false;
    }
    
    public Event(String title, String description, String eventCode, User host, 
                 LocalDateTime eventDateTime, String location, Boolean isOnline) {
        this.title = title;
        this.description = description;
        this.eventCode = eventCode;
        this.host = host;
        this.eventDateTime = eventDateTime;
        this.location = location;
        this.isOnline = isOnline;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getEventCode() {
        return eventCode;
    }
    
    public void setEventCode(String eventCode) {
        this.eventCode = eventCode;
    }
    
    public User getHost() {
        return host;
    }
    
    public void setHost(User host) {
        this.host = host;
    }
    
    public LocalDateTime getEventDateTime() {
        return eventDateTime;
    }
    
    public void setEventDateTime(LocalDateTime eventDateTime) {
        this.eventDateTime = eventDateTime;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Boolean getIsOnline() {
        return isOnline;
    }
    
    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}