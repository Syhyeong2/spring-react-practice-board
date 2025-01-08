package com.syhy.login_jwt_practice.user;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;

// 사용자 세부 정보 클래스
@Getter
public class CustomUserDetails implements UserDetails {

    // 사용자 정보
    private final User user;

    // 생성자
    public CustomUserDetails(User user) {
        this.user = user;
    }

    // 권한 컬렉션 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole()));
    }

    // 비밀번호 반환
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // 사용자 이름 반환
    @Override
    public String getUsername() {
        return user.getUsername();
    }

    // 계정 만료 여부 반환
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 자격 증명 만료 여부 반환
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 사용자 활성 여부 반환    
    @Override
    public boolean isEnabled() {
        return true;
    }
}
