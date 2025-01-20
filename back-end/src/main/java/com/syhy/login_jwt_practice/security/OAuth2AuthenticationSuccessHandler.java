package com.syhy.login_jwt_practice.security;

import java.io.IOException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


// OAuth2 인증 성공 시 처리
// 인증 성공시, accessToken, refreshToken 반환
// http only cookie 생성
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String accessToken = jwtTokenProvider.generateAccessToken(user.getAttribute("email"));
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getAttribute("email"));

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        response.addCookie(refreshTokenCookie);

        response.setHeader("Authorization", "Bearer " + accessToken);
        // 클라이언트에게 리다이렉트 응답 보내기
        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/callback")
            .build().toUriString();
        response.sendRedirect(redirectUrl);
    
    }
}
