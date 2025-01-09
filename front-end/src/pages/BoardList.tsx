import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBoardList } from "../services/boardService";
import { IBoard } from "../types/BoardTypes";
import useErrorHandler from "../hooks/useErrorHandler";
import { BoardSearchForm } from "../hooks/BoardSearchForm";
import BoardCard from "../components/BoardCard";
import BoardCardSkeleton from "../components/BoardCardSkeleton";

export default function BoardList() {
  // 게시판 데이터 상태
  const [boards, setBoards] = useState<IBoard[]>([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 로그아웃 함수, 토큰을 전역 상태에서 가져옴
  const { token } = useAuthStore();
  // 에러 처리 커스텀 훅
  const { handleBoardError } = useErrorHandler();
  // 페이지 상태
  const [page, setPage] = useState(0);
  // 파라미터
  const params = new URLSearchParams({
    // Example parameters
    page: page.toString(),
    size: "10",
  });

  // 게시판 데이터 가져오기
  useEffect(() => {
    // 패칭 함수
    const fetchBoardData = async () => {
      // 로딩 상태 업데이트
      setIsLoading(true);
      // 게시판 데이터 패칭
      const response = await getBoardList(params.toString(), token);
      // 응답 성공 여부
      if (response.success) {
        // 게시판 데이터 업데이트
        setBoards((prev) => {
          // 이전 게시판 데이터 중복 제거
          const newBoardIds = new Set(prev.map((board) => board.id));
          // 새로운 게시판 데이터 필터링
          const uniqueBoards = response.data?.content?.filter(
            (board) => !newBoardIds.has(board.id)
          );
          // 이전 게시판 데이터와 새로운 게시판 데이터 합치기
          return [...prev, ...(uniqueBoards ?? [])];
        });
        // 로딩 상태 업데이트
        setIsLoading(false);
      } else {
        // 에러 처리
        handleBoardError(response.status);
      }
    };
    // 패칭 함수 실행
    fetchBoardData();
  }, [page, token]); // 의존성 배열에 필요한 값

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="text-2xl font-bold mt-24">BoardList</div>
      <div className="flex flex-col items-center justify-center gap-5">
        <BoardSearchForm />
        {/* 게시판 데이터 매핑 */}
        {boards.map((board, index) => (
          <BoardCard board={board} index={index} />
        ))}
        {isLoading && [...Array(10)].map((_, index) => <BoardCardSkeleton />)}
      </div>
      {/* 게시글 작성 버튼 */}
      <div className="flex flex-row gap-10">
        <Link to="/board/write" className="btn btn-primary">
          Write
        </Link>
        <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
