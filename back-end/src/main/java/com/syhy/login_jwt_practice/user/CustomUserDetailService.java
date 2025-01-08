package com.syhy.login_jwt_practice.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// 사용자 세부 정보 서비스
@Service
public class CustomUserDetailService implements UserDetailsService {

    // 사용자 저장소 주입
    @Autowired
    private UserRepository userRepository;

    // 사용자 이름으로 사용자 세부 정보 로드
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자 이름으로 사용자 찾은 후 사용자 세부 정보 반환
        return userRepository.findByUsername(username).map(CustomUserDetails::new).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
