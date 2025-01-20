package com.syhy.login_jwt_practice.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 일반 인증 정보
    @Column(name = "username", nullable = true, unique = true)
    private String username;
    @Column(name = "password", nullable = true)
    private String password;

    //　공통 필드
    @Column(name = "email", nullable = false)
    private String email;

    // OAuth2 인증 정보
    @Column(name = "provider", nullable = true)
    private String provider;
    @Column(name = "provider_id", nullable = true)
    private String providerId;

    @Builder.Default
    private String role = "USER";

}

