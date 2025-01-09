import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";
import BoardUpdateModal from "../components/BoardUpdateModal";
import { deleteBoard, getBoardDetail } from "../services/boardService";
import useErrorHandler from "../hooks/useErrorHandler";

export default function BoardDetail() {
  // 게시글 아이디
  const { id } = useParams();
  // 게시글 데이터 상태
  const [board, setBoard] = useState<any>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 삭제 로딩 상태
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  // 수정 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  // 토큰 상태, 로그아웃 함수
  const { token } = useAuthStore();
  // 네비게이션 함수
  const navigate = useNavigate();
  // 에러 처리 커스텀 훅
  const { handleBoardError } = useErrorHandler();

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchBoardData = async () => {
      setIsLoading(true);
      const response = await getBoardDetail(id as string, token);
      if (response.status === 200) {
        setBoard(response.data);
      } else {
        // 에러 처리
        handleBoardError(response.status);
      }
      setIsLoading(false);
    };
    // 패칭 함수 실행
    fetchBoardData();
  }, [id, isEditModalOpen]); // 의존성 배열에 필요한 값

  // 게시글 삭제 함수
  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const response = await deleteBoard(id as string, token);
    if (response.status === 204) {
      console.log(response);
      navigate("/board");
    } else {
      handleBoardError(response.status);
    }
    setIsDeleteLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <div className="text-2xl font-bold">BoardDetail</div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-48 h-8 shadow-xl cursor-pointer skeleton"></div>
          <div className="w-48 h-12 shadow-xl cursor-pointer skeleton"></div>
        </div>
      ) : (
        <>
          {/* 게시글 제목 */}
          <div className="card-title text-primary">{board?.title}</div>
          {/* 게시글 내용 */}
          <div className="card-text text-white">{board?.content}</div>
        </>
      )}

      <div className="flex gap-5">
        {/* 수정 버튼 */}
        <button
          className="btn btn-success"
          onClick={() => setIsEditModalOpen(true)}
          disabled={isLoading}
        >
          수정
        </button>
        {/* 수정 모달 */}
        {isEditModalOpen && (
          <BoardUpdateModal
            setIsEditModalOpen={setIsEditModalOpen}
            boardProps={board}
          />
        )}
        {/* 삭제 버튼 */}

        <button
          className="btn btn-error"
          onClick={handleDelete}
          disabled={isDeleteLoading || isLoading}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
