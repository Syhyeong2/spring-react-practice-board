package com.syhy.login_jwt_practice.board;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.syhy.login_jwt_practice.exception.DetailBoardNotFoundException;
import com.syhy.login_jwt_practice.exception.UserNotFoundException;
import com.syhy.login_jwt_practice.exception.UserNotMatchedException;
import com.syhy.login_jwt_practice.user.User;
import com.syhy.login_jwt_practice.user.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class BoardService {

    // 게시글 레포지토리 주입
    @Autowired
    private BoardRepository boardRepository;

    // 유저 레포지토리 주입
    @Autowired
    private UserRepository userRepository;

    // 게시글 전체 조회
    // Page 
    public Page<BoardResponseDTO> getBoards(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<BoardEntity> boardEntities = boardRepository.findAll(pageRequest);
        return boardEntities.map(BoardResponseDTO::fromEntity);
    }

    // 게시글 상세 조회
    @Transactional
    public BoardResponseDTO getBoardDetail(Long id) {
        // 게시글 엔티티 조회
        Optional<BoardEntity> boardEntity = boardRepository.findById(id);
        // 게시글 엔티티 존재 여부 확인
        if (!boardEntity.isPresent()) {
            throw new DetailBoardNotFoundException(id + "번 게시글이 존재하지 않습니다.");
        }

        try {
            // 게시글 응답 DTO 생성
            BoardResponseDTO boardResponseDTO = BoardResponseDTO.fromEntity(boardEntity.get());
            // 게시글 응답 DTO 반환
            return boardResponseDTO;
        } catch (Exception e) {
            throw new RuntimeException("게시글 조회 에러");
        }
    }


    // 게시글 작성
    public BoardEntity writeBoard(BoardRequestDTO boardRequestDTO, String username) {
        // 유저 조회
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username + "유저가 존재하지 않습니다."));
        // 게시글 엔티티 생성
        try {
            BoardEntity boardEntity = new BoardEntity();
            boardEntity.setTitle(boardRequestDTO.getTitle());
            boardEntity.setContent(boardRequestDTO.getContent());
            boardEntity.setUser(user);
            boardEntity.setHits(0L);
            boardEntity.setCreatedAt(LocalDateTime.now());
            boardEntity.setUpdatedAt(LocalDateTime.now());
            // 게시글 엔티티 저장
            return boardRepository.save(boardEntity);
        } catch (Exception e) {
            throw new RuntimeException("게시글 작성 에러");
        }
    }

    // 게시글 수정
    public BoardEntity updateBoard(Long id, BoardRequestDTO boardRequestDTO, String username) {
        // 유저 조회
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username + "유저가 존재하지 않습니다."));

        // 게시글 엔티티 조회
        BoardEntity boardEntity = boardRepository.findById(id)
                .orElseThrow(() -> new DetailBoardNotFoundException(id + "번 게시글이 존재하지 않습니다."));

        if(!boardEntity.getUser().getId().equals(user.getId())) {
            throw new UserNotMatchedException(username + "유저가 일치하지 않습니다.");
        }

        // 게시글 엔티티 수정
        boardEntity.setTitle(boardRequestDTO.getTitle());
        boardEntity.setContent(boardRequestDTO.getContent());
        boardEntity.setUpdatedAt(LocalDateTime.now());
        // 게시글 엔티티 저장
        try {
            return boardRepository.save(boardEntity);
        } catch (Exception e) {
            throw new RuntimeException("게시글 수정 에러");
        }
    }
    
    // 게시글 삭제
    public void deleteBoardById(Long id, String username) {
        // 유저 조회
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username + "유저가 존재하지 않습니다."));
        
        // 게시글 엔티티 조회
        BoardEntity boardEntity = boardRepository.findById(id)
                .orElseThrow(() -> new DetailBoardNotFoundException(id + "번 게시글이 존재하지 않습니다."));
        
        if(!boardEntity.getUser().getId().equals(user.getId())) {
            throw new UserNotMatchedException(username + "유저가 일치하지 않습니다.");
        }

        // 게시글 엔티티 삭제
        try {
            boardRepository.delete(boardEntity);
        } catch (Exception e) {
            throw new RuntimeException("게시글 삭제 에러");
        }
    }

    // 게시글 검색
    public Page<BoardResponseDTO> searchBoard(String query, int page, int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<BoardEntity> boardEntities = boardRepository.findByTitleContaining(query, pageRequest);
            return boardEntities.map(BoardResponseDTO::fromEntity);
        } catch (Exception e) {
            throw new RuntimeException("게시글 검색 에러");
        }
    }
}
