package com.syhy.login_jwt_practice.configutation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.syhy.login_jwt_practice.security.JwtAccessDeniedHandler;
import com.syhy.login_jwt_practice.security.JwtAuthenticationEntryPoint;
import com.syhy.login_jwt_practice.security.JwtAuthenticationFilter;
import com.syhy.login_jwt_practice.security.JwtTokenProvider;
import com.syhy.login_jwt_practice.user.CustomUserDetailService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 사용자 세부 정보 서비스 주입
    @Autowired
    private CustomUserDetailService customUserDetailService;

    // JwtTokenProvider 주입
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;


    // 비밀번호 인코더 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 인증 관리자 빈 등록
    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http
    ) throws Exception {
        // 인증 관리자 빌드
        AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        // 사용자 세부 정보 서비스 설정
        authManagerBuilder.userDetailsService(customUserDetailService)
                          // 비밀번호 인코더 설정
                          .passwordEncoder(passwordEncoder());
        // 인증 관리자 빌드
        return authManagerBuilder.build();
    }

    //JWT 인증 필터 빈 등록
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        //JwtAuthenticationFilter 생성
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }

    //SecurityFilterChain 빈 등록
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //세션 관리 설정: 세션을 생성하지 않고 상태를 유지하지 않도록 설정합니다.
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //CSRF 보호 비활성화: CSRF 보호를 비활성화합니다.
        http.csrf(csrf -> csrf.disable());

        //인증 요청 설정: 특정 경로에 대한 인증을 비활성화하고, 나머지 요청은 인증된 사용자만 접근할 수 있도록 설정합니다.
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/h2-console/**", "/login", "/register", "/refresh").permitAll()
                .anyRequest().authenticated());

        //JWT 인증 필터 추가: JwtAuthenticationFilter를 UsernamePasswordAuthenticationFilter 앞에 추가합니다.
        http.addFilterBefore(
                jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class);

        //
        http.exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(jwtAuthenticationEntryPoint) // 401 처리
                .accessDeniedHandler(jwtAccessDeniedHandler)           // 403 처리
        );

        //H2 콘솔 허용: H2 콘솔을 허용
        http.headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }
    



}


