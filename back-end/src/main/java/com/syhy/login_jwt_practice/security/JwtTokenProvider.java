package com.syhy.login_jwt_practice.security;




import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    // 토큰 서명 키 설정
    private final String SECRET_KEY = "MySecretKey123456789012345678901234";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 토큰 만료 시간 설정
    private final long EXPIRATION_TIME = 3000000; // 3000000ms = 3000s = 3000/60 = 50min

    //JWT 토큰 생성
    public String generateToken(String username) {
        // 토큰 생성
        return Jwts.builder()
                // 토큰 바디 설정
                .setSubject(username)
                // 토큰 발행 시간 설정
                .setIssuedAt(new Date())
                // 토큰 만료 시간 설정
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                // 토큰 서명 키 설정
                .signWith(key)
                // 토큰 컴팩트
                .compact();
    }
    
    //JWT 토큰에서 사용자 이름 추출
    public String getUsernameFromToken(String token) {
        // 토큰 파싱
        return Jwts.parserBuilder()
                // 토큰 서명 키 설정
                .setSigningKey(key)
                .build()
                // 토큰 파싱
                .parseClaimsJws(token)
                // 토큰 바디 추출
                .getBody()
                // 사용자 이름 추출
                .getSubject();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            // 토큰 파싱
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                    .parseClaimsJws(token);
            //검증 성공
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            // 토큰 서명 검증 실패
            System.out.println("Invalid JWT signature.");
        } catch (ExpiredJwtException e) {
            // 토큰 만료
            System.out.println("Expired JWT token.");
        } catch (UnsupportedJwtException e) {
            // 지원하지 않는 토큰
            System.out.println("Unsupported JWT token.");
        } catch (IllegalArgumentException e) {
            // 토큰 클레임이 비어있음
            System.out.println("JWT claims string is empty.");
        }
        //검증 실패
        return false;
    }
}
