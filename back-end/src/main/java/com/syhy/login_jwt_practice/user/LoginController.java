package com.syhy.login_jwt_practice.user;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.syhy.login_jwt_practice.exception.RefreshTokenInvalidException;
import com.syhy.login_jwt_practice.security.JwtTokenProvider;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class LoginController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 로그인 앤드포인트
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody UserRequestDTO user, HttpServletResponse response) {
        System.out.println("user: " + user);
        // 아이디/비밀번호 검증
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()));
        // 인증 성공 시, JWT 생성
        String accessToken = jwtTokenProvider.generateAccessToken(authentication.getName());
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication.getName());
        // 보통 JSON 형태로 내려줍니다.
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true); // HTTPS 환경 필수
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(1 * 24 * 60 * 60);

        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true); // HTTPS 환경 필수
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(15 * 60);


        response.addCookie(refreshTokenCookie);
        response.addCookie(accessTokenCookie);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // 사용자 등록 앤드포인트
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRequestDTO user) {
        // 사용자 등록 메서드 호출 후 결과 저장
        userService.registerUser(user);
        // 결과가 null이 아닌 경우 true 반환
        return ResponseEntity.ok("회원가입 완료");
    }


    // 리프레시 토큰 재발급 앤드포인트  
    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("refresh 호출");
        // 리프레시 토큰 쿠키 추출
        String refreshToken = null;
        // 쿠키 추출
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if (c.getName().equals("refreshToken")) {
                    refreshToken = c.getValue();
                }
            }
        }
        
        // 리프레시 토큰 유효성 검증
        if (refreshToken == null || !jwtTokenProvider.validateToken(refreshToken)) {
            throw new RefreshTokenInvalidException("유효하지 않은 리프레시 토큰입니다");
        }

        // 리프레시 토큰에서 사용자 이름 추출
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);

        // 새로운 액세스 토큰 생성
        String newAccessToken = jwtTokenProvider.generateAccessToken(username);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(username);

        // 리프레시 토큰 쿠키 생성
        Cookie refreshTokenCookie = new Cookie("refreshToken", newRefreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(1 * 24 * 60 * 60);

        
        // 새로운 액세스 토큰 반환
        Cookie accessTokenCookie = new Cookie("accessToken", newAccessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(15 * 60);

        response.addCookie(refreshTokenCookie);
        response.addCookie(accessTokenCookie);

        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @PostMapping("/delete-cookies")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // (1) accessToken 쿠키 만료시키기
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setMaxAge(0); // 즉시 만료
        // SameSite 설정이 필요하다면 직접 추가
        response.addCookie(accessTokenCookie);

        // (2) refreshToken 쿠키 만료시키기
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().body("Logged out successfully");
    }




    // 테스트 앤드포인트
    @GetMapping("/test")
    public ResponseEntity<String> test(HttpServletRequest request) {
        // Extract the token from the Authorization header
        // 쿠키에서 accessToken 가져오기
        Cookie accessTokenCookie = Arrays.stream(request.getCookies())
            .filter(cookie -> "accessToken".equals(cookie.getName()))
            .findFirst()
            .orElse(null);  
        if (accessTokenCookie != null) {
            String accessToken = accessTokenCookie.getValue();
            if (jwtTokenProvider.validateToken(accessToken)) {
                return ResponseEntity.ok("your token is valid");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("your token is invalid");
    }

    @GetMapping("/test2")
    public ResponseEntity<String> test2(HttpServletRequest request) {
        // Extract the token from the Authorization header
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7).trim(); // Remove "Bearer " prefix and trim spaces
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Authorization header");
        }

        // Get username from token
        String username = jwtTokenProvider.getUsernameFromToken(token);
        return ResponseEntity.ok("your token is valid " + username);
    }



}
