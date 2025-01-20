package com.syhy.login_jwt_practice.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
// 예외 응답 클래스
public class ErrorResponse {
    private final LocalDateTime timestamp; // 예외 발생 시각
    private final int status;              // HTTP 상태 코드
    private final String error;            // 오류 요약 (e.g., NOT_FOUND)
    private final String message;          // 상세 메시지
    private final String path;             // 요청 경로
    
public static ErrorResponse makeError(String message, HttpStatus status, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .build();
    }
}
