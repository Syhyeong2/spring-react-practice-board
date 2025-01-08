package com.syhy.login_jwt_practice.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // JwtTokenProvider 주입
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // 필터 내부 실행
    @Override
    protected void doFilterInternal(
        // 요청, 응답, 필터 체인 주입
        @NonNull HttpServletRequest request, 
        @NonNull HttpServletResponse response, 
        @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        //Authorization 헤더 가져오기: 클라이언트가 요청 시 JWT를 포함하는 헤더입니다. 일반적으로 Authorization: Bearer <token> 형태로 전송됩니다.
        String header = request.getHeader("Authorization");

        //헤더가 존재하고, 헤더가 "Bearer "로 시작하는지 확인
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            //헤더에서 JWT 추출: "Bearer " 다음에 오는 토큰을 추출합니다.
            String token = header.substring(7);
            System.out.println("token: " + token);
            //JWT 유효성 검사: 토큰이 유효한지 검사합니다.
            if (jwtTokenProvider.validateToken(token)) {
                //토큰에서 사용자 이름 추출: 토큰에서 사용자 이름을 추출합니다.
                String username = jwtTokenProvider.getUsernameFromToken(token);

                //인증 토큰 생성: 사용자 이름을 사용하여 인증 토큰을 생성합니다.
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
                //인증 토큰을 SecurityContextHolder에 설정: 인증 토큰을 SecurityContextHolder에 설정하여 인증 상태를 설정합니다.
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("username: " + username);
            } 
        } 
        //다음 필터로 요청 전달: 인증 토큰이 설정되었으면 다음 필터로 요청을 전달합니다.
        filterChain.doFilter(request, response);
    }
}
