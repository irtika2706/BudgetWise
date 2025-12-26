package com.budgetwise.service;

import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtil.generateToken(email);
    }

    public void generateResetToken(String email) {

       User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email not found"));

       String token = UUID.randomUUID().toString();

       user.setResetToken(token);
       user.setResetTokenExpiry(System.currentTimeMillis() + 15 * 60 * 1000); // 15 minutes

       userRepository.save(user);

    // In real app → email token
    System.out.println("RESET TOKEN (DEV ONLY): " + token);
    }

       public void resetPassword(String token, String newPassword) {

       User user = userRepository.findAll().stream()
            .filter(u -> token.equals(u.getResetToken()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

       if (user.getResetTokenExpiry() < System.currentTimeMillis()) {
            throw new RuntimeException("Reset token expired");
       }

       user.setPassword(passwordEncoder.encode(newPassword));
       user.setResetToken(null);
       user.setResetTokenExpiry(null);

       userRepository.save(user);
    }


}

