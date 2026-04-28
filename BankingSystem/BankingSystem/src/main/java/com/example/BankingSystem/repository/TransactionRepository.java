package com.example.BankingSystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.BankingSystem.entity.Transaction;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderEmailOrReceiverEmail(String sender, String receiver);
}