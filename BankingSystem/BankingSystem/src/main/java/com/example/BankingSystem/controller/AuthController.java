package com.example.BankingSystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.BankingSystem.dto.LoginRequest;
import com.example.BankingSystem.dto.RegisterRequest;
import com.example.BankingSystem.entity.User;
import com.example.BankingSystem.repository.UserRepository;
import com.example.BankingSystem.security.JwtUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;  // ✅ Add this

    // ✅ Add jwtUtil to constructor
    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ... your existing register method stays same ...

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isMatch = passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()
        );

        if (!isMatch) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid password"));
        }

        // ✅ Use injected jwtUtil — not static call
        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "fullName", user.getFullName()
        ));
    }
}