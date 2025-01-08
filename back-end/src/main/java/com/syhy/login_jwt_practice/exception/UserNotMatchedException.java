package com.syhy.login_jwt_practice.exception;

// 유저가 일치하지 않는 경우
public class UserNotMatchedException extends RuntimeException {
    public UserNotMatchedException(String message) {
        super(message);
    }
}
