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

    private String getLoggedInUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = getLoggedInUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestParam Double amount) {
        if (amount <= 0)
            return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));

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

        return ResponseEntity.ok(Map.of(
                "message", "Deposit successful",
                "newBalance", user.getBalance()
        ));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestParam Double amount) {
        if (amount <= 0)
            return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));

        String email = getLoggedInUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getBalance() < amount)
            return ResponseEntity.badRequest().body(Map.of("error", "Insufficient balance"));

        user.setBalance(user.getBalance() - amount);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.WITHDRAW);
        tx.setAmount(amount);
        tx.setSenderEmail(email);

        transactionRepository.save(tx);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Withdrawal successful",
                "newBalance", user.getBalance()
        ));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @RequestParam String receiverAccount,
            @RequestParam Double amount) {

        if (amount <= 0)
            return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));

        String senderEmail = getLoggedInUserEmail();
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findByAccountNumber(receiverAccount).orElse(null);

        if (receiver == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Account number not found"));

        if (sender.getAccountNumber().equals(receiverAccount))
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot transfer to your own account"));

        if (sender.getBalance() < amount)
            return ResponseEntity.badRequest().body(Map.of("error", "Insufficient balance"));

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        Transaction tx = new Transaction();
        tx.setType(TransactionType.TRANSFER);
        tx.setAmount(amount);
        tx.setSenderEmail(senderEmail);
        tx.setReceiverEmail(receiver.getEmail());

        transactionRepository.save(tx);
        userRepository.save(sender);
        userRepository.save(receiver);

        return ResponseEntity.ok(Map.of(
                "message", "Transfer successful to " + receiver.getFullName(),
                "newBalance", sender.getBalance()
        ));
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions() {
        String email = getLoggedInUserEmail();
        List<Transaction> transactions =
                transactionRepository.findBySenderEmailOrReceiverEmail(email, email);
        return ResponseEntity.ok(transactions);
    }
}