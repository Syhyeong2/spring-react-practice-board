package com.syhy.login_jwt_practice.board;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/board")
@Slf4j
public class BoardController {

    // BoardService 주입
    @Autowired
    private BoardService boardService;

    // 게시판 목록 조회
    @GetMapping("/boardList")
    public ResponseEntity<Page<BoardResponseDTO>> getBoards(@RequestParam int page, @RequestParam int size) {
        log.info("getBoards 호출");

        // 게시판 목록 조회
        Page<BoardResponseDTO> boardResponseDTOs = boardService.getBoards(page, size);
        // 게시판 목록 반환
        return ResponseEntity.status(HttpStatus.OK).body(boardResponseDTOs);
    }

    // 게시판 상세 조회
    @GetMapping("/boardDetail/{id}")
    public ResponseEntity<BoardResponseDTO> getBoardDetail(@PathVariable Long id) {
        log.info("getBoardDetail 호출");
        // 게시판 상세 조회
        BoardResponseDTO boardResponseDTO = boardService.getBoardDetail(id);

        // 게시판 상세 반환
        return ResponseEntity.status(HttpStatus.OK).body(boardResponseDTO);
    }

    // 게시판 작성
    @PostMapping("/boardWrite")
    public ResponseEntity<BoardEntity> writeBoard(@RequestBody BoardRequestDTO boardRequestDTO) {
        log.info("writeBoard 호출");
        // 인증 정보 추출
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // 게시판 작성
        boardService.writeBoard(boardRequestDTO, username);

        // 게시판 작성 성공
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 게시판 수정
    @PutMapping("/boardUpdate/{id}")
    public ResponseEntity<BoardEntity> updateBoard(@PathVariable Long id,
            @RequestBody BoardRequestDTO boardRequestDTO) {
        log.info(id + "번 게시글 updateBoard 호출");
        // 인증 정보 추출
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // 게시판 수정
        boardService.updateBoard(id, boardRequestDTO, username);

        // 게시판 수정 성공
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // 게시판 삭제
    @DeleteMapping("/boardDelete/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id) {
        log.info(id + "번 게시글 deleteBoard 호출");
        // 인증 정보 추출
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // 게시판 삭제
        boardService.deleteBoardById(id, username);

        // 게시판 삭제 성공
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // 게시판 검색
    @GetMapping("/boardList/search")
    public ResponseEntity<Page<BoardResponseDTO>> searchBoard(@RequestParam String query, @RequestParam int page,
            @RequestParam int size) {
        log.info("searchBoard 호출" + query);
        return ResponseEntity.ok(boardService.searchBoard(query, page, size));
    }

}
