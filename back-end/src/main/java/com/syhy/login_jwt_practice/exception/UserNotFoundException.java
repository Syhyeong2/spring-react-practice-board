package com.syhy.login_jwt_practice.exception;

// 유저가 존재하지 않는 경우
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
