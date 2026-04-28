package com.example.BankingSystem.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.BankingSystem.entity.Transaction;
import com.example.BankingSystem.entity.TransactionType;
import com.example.BankingSystem.entity.User;
import com.example.BankingSystem.repository.TransactionRepository;
import com.example.BankingSystem.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
public class UserController {
      
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public UserController(UserRepository userRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    //  Helper method
    private String getLoggedInUserEmail() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

 

    // Get current user
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    // Deposit
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestParam Double amount) {

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Amount must be greater than 0"));
        }

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBalance(user.getBalance() + amount);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.DEPOSIT);
        tx.setAmount(amount);
        tx.setReceiverEmail(email);

        transactionRepository.save(tx);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Deposit successful"));
    }

    //  Withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestParam Double amount) {

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Amount must be greater than 0"));
        }

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getBalance() < amount) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Insufficient balance"));
        }

        user.setBalance(user.getBalance() - amount);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.WITHDRAW);
        tx.setAmount(amount);
        tx.setSenderEmail(email);

        transactionRepository.save(tx);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Withdraw successful"));
    }

    //  Transfer
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @RequestParam String receiverEmail,
            @RequestParam Double amount) {

        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Amount must be greater than 0"));
        }

        String senderEmail = getLoggedInUserEmail();

        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (senderEmail.equals(receiverEmail)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cannot transfer to yourself"));
        }

        if (sender.getBalance() < amount) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Insufficient balance"));
        }

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.TRANSFER);
        tx.setAmount(amount);
        tx.setSenderEmail(senderEmail);
        tx.setReceiverEmail(receiverEmail);

        transactionRepository.save(tx);
        userRepository.save(sender);
        userRepository.save(receiver);

        return ResponseEntity.ok(Map.of("message", "Transfer successful"));
    }

    // Transactions
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions() {

        String email = getLoggedInUserEmail();

        List<Transaction> transactions =
                transactionRepository.findBySenderEmailOrReceiverEmail(email, email);

        return ResponseEntity.ok(transactions);
    }
}