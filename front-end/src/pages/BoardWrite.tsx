import { useState } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { useNavigate } from "react-router-dom";
import { writeBoard } from "../services/boardService";
import useErrorHandler from "../hooks/useErrorHandler";

export default function BoardWrite() {
  // 게시글 데이터 상태
  const [board, setBoard] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  // 오류 상태
  const [error, setError] = useState("");
  // 토큰 상태
  const { token } = useAuthStore();
  // 네비게이션 함수
  const navigate = useNavigate();

  // 오류 처리 함수
  const { handleBoardError } = useErrorHandler();
  // 게시글 작성 함수
  const handleWrite = async () => {
    const response = await writeBoard(board, token);
    if (response.status === 201) {
      navigate("/board");
    } else {
      handleBoardError(response.status);
    }
  };

  // 제목 변경 함수
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBoard({ ...board, title: value });
  };
  // 내용 변경 함수
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setBoard({ ...board, content: value });
  };

  // 페이지 렌더링
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      {/* 제목 입력 */}
      <input
        className="input input-bordered w-full max-w-xs"
        type="text"
        id="title"
        placeholder="제목"
        onChange={handleTitleChange}
      />
      {/* 내용 입력 */}
      <textarea
        className="textarea textarea-bordered w-full max-w-xs h-80"
        id="content"
        placeholder="내용"
        onChange={handleContentChange}
      />
      {/* 작성 버튼 */}
      <button className="btn btn-primary" onClick={handleWrite}>
        작성
      </button>
      {/* 오류 메시지 */}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
