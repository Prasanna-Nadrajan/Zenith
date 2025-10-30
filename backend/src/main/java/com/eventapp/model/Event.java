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
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public Event() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Event(String title, String description, String eventCode, User host) {
        this.title = title;
        this.description = description;
        this.eventCode = eventCode;
        this.host = host;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}