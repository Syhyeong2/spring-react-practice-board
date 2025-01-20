package com.syhy.login_jwt_practice.user;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;


// OAuth2 인증 서비스
// OAuth2 인증 요청을 받아서, OAuth2 인증 결과를 반환
// 인증 결과를 DB에 저장
@Service
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        //Provider 식별
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oauth2User.getAttributes();
        
        String providerId = String.valueOf(attributes.get("id"));
        String email = extractEmail(registrationId, attributes);

        User user = saveOrUpdateUser(email, providerId, registrationId);
        log.info("OAuth2 Login. User: {}, Provider: {}", user.getEmail(), user.getProvider());


        return oauth2User;
    }
    
    // 유저 저장 또는 업데이트
    private User saveOrUpdateUser(String email, String providerId, String provider) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setProviderId(providerId);
            user.setProvider(provider);
        } else {
            user = User.builder()
                    .email(email)
                    .providerId(providerId)
                    .provider(provider)
                    .build();
        }
        return userRepository.save(user);
    }

    // Provider 별로 이메일 추출
    private String extractEmail(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId) {
            case "google", "github" -> (String) attributes.get("email");
            // Add more cases for other providers like "naver", "kakao" if needed
            default -> null;
        };
    }
}
