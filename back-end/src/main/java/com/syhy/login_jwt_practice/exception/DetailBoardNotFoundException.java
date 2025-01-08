package com.syhy.login_jwt_practice.exception;

// 게시판 상세 조회 시 게시판이 존재하지 않는 경우
public class DetailBoardNotFoundException extends RuntimeException {
    public DetailBoardNotFoundException(String message) {
        super(message);
    }
}
