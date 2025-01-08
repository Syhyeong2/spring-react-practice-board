package com.syhy.login_jwt_practice.board;

import java.time.LocalDateTime;

import com.syhy.login_jwt_practice.user.User;

import lombok.Data;

// 게시글 응답 DTO
@Data
public class BoardResponseDTO {
    private Long id;
    private String title;
    private String content;
    private Long hits;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BoardUserResponseDTO user;


    public static BoardResponseDTO fromEntity(BoardEntity boardEntity) {
        BoardResponseDTO boardResponseDTO = new BoardResponseDTO();
        boardResponseDTO.setId(boardEntity.getId());
        boardResponseDTO.setTitle(boardEntity.getTitle());
        boardResponseDTO.setContent(boardEntity.getContent());
        boardResponseDTO.setHits(boardEntity.getHits());
        boardResponseDTO.setCreatedAt(boardEntity.getCreatedAt());
        boardResponseDTO.setUpdatedAt(boardEntity.getUpdatedAt());
        boardResponseDTO.setUser(BoardUserResponseDTO.fromEntity(boardEntity.getUser()));
        return boardResponseDTO;
    }
}

// 게시글 작성자 응답 DTO
@Data
class BoardUserResponseDTO {
    private Long id;
    private String username;

    public static BoardUserResponseDTO fromEntity(User user) {
        BoardUserResponseDTO boardUserResponseDTO = new BoardUserResponseDTO();
        boardUserResponseDTO.setId(user.getId());
        boardUserResponseDTO.setUsername(user.getUsername());
        return boardUserResponseDTO;
    }
}
