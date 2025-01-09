import { useState } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { updateBoard } from "../services/boardService";
import useErrorHandler from "../hooks/useErrorHandler";

// 게시글 수정 모달 컴포넌트
export default function BoardUpdateModal({
  setIsEditModalOpen,
  boardProps,
}: {
  // 모달 상태 업데이트 함수
  setIsEditModalOpen: (isOpen: boolean) => void;
  // 게시글 데이터
  boardProps: any | null;
}) {
  // 토큰 상태
  const { token } = useAuthStore();
  // 수정 로딩 상태
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  // 오류 처리 함수
  const { handleBoardError } = useErrorHandler();
  // 게시글 수정 함수
  const handleUpdate = async () => {
    setIsUpdateLoading(true);
    const response = await updateBoard(board, boardProps?.id, token);
    if (response.status === 200) {
      // 모달 닫기
      setIsEditModalOpen(false);
    } else {
      handleBoardError(response.status);
    }
    setIsUpdateLoading(false);
  };

  // 게시글 데이터 상태
  const [board, setBoard] = useState<{ title: string; content: string }>({
    title: boardProps?.title || "",
    content: boardProps?.content || "",
  });

  // 페이지 렌더링
  return (
    <div className="modal modal-open">
      <div className="modal-box flex flex-col items-center justify-center">
        {/* 제목 */}
        <h3 className="font-bold text-lg mb-5">Update Board</h3>
        {/* 제목 입력 */}
        <input
          value={board?.title}
          type="text"
          placeholder="Title"
          className="input input-bordered mb-5 w-64"
          onChange={(e) => setBoard({ ...board, title: e.target.value })}
        />
        {/* 내용 */}
        <textarea
          value={board?.content}
          placeholder="Content"
          className="textarea textarea-bordered mb-5 w-64 h-60"
          onChange={(e) => setBoard({ ...board, content: e.target.value })}
        />
        <div className="flex gap-3">
          {/* 수정 버튼 */}
          <button
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={isUpdateLoading}
          >
            {isUpdateLoading ? "수정중..." : "수정"}
          </button>
          {/* 닫기 버튼 */}
          <button
            className="btn btn-error"
            onClick={() => setIsEditModalOpen(false)}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
