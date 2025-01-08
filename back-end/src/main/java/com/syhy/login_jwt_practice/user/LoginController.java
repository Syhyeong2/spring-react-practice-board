package com.syhy.login_jwt_practice.user;

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

import com.syhy.login_jwt_practice.security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;



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
    public ResponseEntity<String> login(@RequestBody UserRequestDTO user) {
        System.out.println("user: " + user);
        // 아이디/비밀번호 검증
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()));
        // 인증 성공 시, JWT 생성
        String token = jwtTokenProvider.generateToken(authentication.getName());
        // 보통 JSON 형태로 내려줍니다.
        // 여기서는 예제로 문자열만 리턴
        return ResponseEntity.ok(token);
    }

    // 사용자 등록 앤드포인트
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRequestDTO user) {
        // 사용자 등록 메서드 호출 후 결과 저장
        userService.registerUser(user);
        // 결과가 null이 아닌 경우 true 반환
        return ResponseEntity.ok("회원가입 완료");
    }
    
    // 테스트 앤드포인트
    @GetMapping("/test")
    public ResponseEntity<String> test(HttpServletRequest request) {
        // Extract the token from the Authorization header
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7).trim(); // Remove "Bearer " prefix and trim spaces
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Authorization header");
        }
        
        // Validate the token
        if (jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.ok("your token is valid");
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
