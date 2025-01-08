package com.syhy.login_jwt_practice;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.syhy.login_jwt_practice.board.BoardEntity;
import com.syhy.login_jwt_practice.board.BoardRepository;
import com.syhy.login_jwt_practice.user.User;
import com.syhy.login_jwt_practice.user.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BoardRepository boardRepository;

    @Override
    public void run(String... args) throws Exception {
        // 이미 User 테이블에 해당 username이 존재하지 않을 경우에만 저장
        if (userRepository.findByUsername("testUser").isEmpty()) {
            User user = new User();
            user.setUsername("testUser");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setRole("ROLE_USER");
            userRepository.save(user);
            // 게시판 데이터 생성
            for (int i = 1; i <= 100; i++) {
                BoardEntity board = new BoardEntity();
                board.setTitle("testTitle" + i);
                board.setContent("testContent" + i);
                board.setUser(user);
                board.setHits(0L);
                board.setCreatedAt(LocalDateTime.now());
                board.setUpdatedAt(LocalDateTime.now());
                boardRepository.save(board);
            }
        }

    }
}
