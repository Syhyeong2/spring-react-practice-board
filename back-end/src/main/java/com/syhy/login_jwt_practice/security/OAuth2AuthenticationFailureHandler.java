package com.syhy.login_jwt_practice.security;


import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.syhy.login_jwt_practice.exception.ErrorResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// OAuth2 인증 실패 시 처리
// 인증 실패시, http status 반환
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
         // 1. ErrorResponse 생성
        String requestUri = request.getRequestURI();
        ErrorResponse errorResponse = ErrorResponse.makeError("OAuth2 access is denied", HttpStatus.FORBIDDEN, requestUri);


        response.getWriter().write(errorResponse.toString());
    }   
}
