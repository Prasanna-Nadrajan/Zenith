package com.eventapp.service;

import com.eventapp.model.User;
import com.eventapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User loginOrRegister(String email) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            User newUser = new User(email);
            return userRepository.save(newUser);
        }
    }
    
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }
}