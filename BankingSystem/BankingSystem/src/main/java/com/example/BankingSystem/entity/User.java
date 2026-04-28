package com.example.BankingSystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @Column(nullable = false)
private String fullName;

@Column(unique = true, nullable = false)
private String email;

@JsonIgnore
@Column(nullable = false)
private String password;

@Column(unique = true, nullable = false)
private String accountNumber;

@Column(nullable = false)
private Double balance = 0.0;




}
