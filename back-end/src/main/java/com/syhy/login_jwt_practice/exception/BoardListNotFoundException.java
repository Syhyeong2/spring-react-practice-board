package com.syhy.login_jwt_practice.exception;

// 게시판 목록 조회 시 게시판이 존재하지 않는 경우
public class BoardListNotFoundException extends RuntimeException {
    public BoardListNotFoundException(String message) {
        super(message);
    }
}
