package com.syhy.login_jwt_practice.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.syhy.login_jwt_practice.exception.ErrorResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    
    private final ObjectMapper objectMapper;

    // ObjectMapper를 DI받거나, Bean을 주입해 사용
    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    // 인증 실패 시 호출되는 메서드
    @Override
    public void commence(
            // 요청 객체
            HttpServletRequest request,
            // 응답 객체
            HttpServletResponse response,
            // 인증 실패 예외
            AuthenticationException authException) 
            throws
            // 예외 처리
            IOException, ServletException {
        
        // 예: "JWT 토큰이 없거나 만료되어서 인증 실패" 상황

        // 1. ErrorResponse 생성
        String requestUri = request.getRequestURI();
        ErrorResponse errorResponse = ErrorResponse.makeError("Invalid or missing JWT token", HttpStatus.UNAUTHORIZED,
                requestUri);
                
        // 2. JSON 변환
        String responseJson = objectMapper.writeValueAsString(errorResponse);

        // 3. HTTP 헤더 세팅
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        // 4. JSON 응답 전송
        response.getWriter().write(responseJson);
    }
}
