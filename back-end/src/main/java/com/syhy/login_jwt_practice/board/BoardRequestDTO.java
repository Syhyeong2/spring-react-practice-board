package com.syhy.login_jwt_practice.board;

import lombok.Data;

// 게시글 요청 DTO
@Data
public class BoardRequestDTO {
    private String title;
    private String content;
}
