package com.syhy.login_jwt_practice.board;

import java.time.LocalDateTime;

import com.syhy.login_jwt_practice.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "board")
@Data
public class BoardEntity {

    // 게시글 아이디
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 게시글 제목
    @Column(name = "title")
    private String title;

    // 게시글 내용
    @Column(name = "content")
    private String content;

    // 게시글 조회수
    @Column(name = "hits")
    private Long hits;

    // 게시글 생성일
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 게시글 수정일
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 게시글 작성자 외래키
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}

