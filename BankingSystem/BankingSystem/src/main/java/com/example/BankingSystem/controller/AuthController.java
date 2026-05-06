package com.example.BankingSystem.controller;

import org.springframework.http.HttpStatus;
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
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (request.getFullName() == null || request.getFullName().isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Full name is required"));

        if (request.getEmail() == null || request.getEmail().isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));

        if (request.getPassword() == null || request.getPassword().length() < 6)
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));

        if (userRepository.findByEmail(request.getEmail()).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already registered"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAccountNumber("ACC" + System.currentTimeMillis());
        user.setBalance(0.0);

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Account created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        if (loginRequest.getEmail() == null || loginRequest.getEmail().isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));

        if (loginRequest.getPassword() == null || loginRequest.getPassword().isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No account found with this email"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Incorrect password"));

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "fullName", user.getFullName()
        ));
    }
}