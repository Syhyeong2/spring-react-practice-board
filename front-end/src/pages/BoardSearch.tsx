import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IBoard } from "../types/BoardTypes";
import { searchBoard } from "../services/boardService";
import useErrorHandler from "../hooks/useErrorHandler";
import BoardCardSkeleton from "../components/BoardCardSkeleton";
import BoardCard from "../components/BoardCard";

export default function BoardSearch() {
  // 검색 키워드
  const { query } = useParams();
  // 네비게이션 함수
  const navigate = useNavigate();
  // 게시판 데이터 상태
  const [boards, setBoards] = useState<IBoard[]>([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 페이지 상태
  const [page, setPage] = useState(0);
  // 오류 처리 함수
  const { handleBoardError } = useErrorHandler();
  // 파라미터
  const params = new URLSearchParams({
    // Example parameters
    page: page.toString(),
    size: "10",
    query: query as string,
  });

  // 게시판 데이터 가져오기
  useEffect(() => {
    // 패칭 함수
    const fetchBoardData = async () => {
      // 로딩 상태 설정
      setIsLoading(true);
      // 게시판 데이터 패칭
      const response = await searchBoard(params.toString());
      // 응답 성공 여부
      if (response.success) {
        setBoards((prev) => {
          // 이전 게시판 데이터 중복 제거
          const newBoardIds = new Set(prev.map((board) => board.id));
          // 새로운 게시판 데이터 필터링
          const uniqueBoards = response.data?.content?.filter(
            (board: IBoard) => !newBoardIds.has(board.id)
          );
          // 이전 게시판 데이터와 새로운 게시판 데이터 합치기
          return [...prev, ...(uniqueBoards ?? [])];
        });
      } else {
        // 에러 처리
        handleBoardError(response.status);
      }
      // 로딩 상태 설정
      setIsLoading(false);
    };
    // 게시판 데이터 패칭
    fetchBoardData();
  }, [page]);

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="text-2xl font-bold mt-24">BoardSearch : {query}</div>
      {isLoading && [...Array(10)].map((_, index) => <BoardCardSkeleton />)}
      {boards.length === 0 ? (
        <div className="text-2xl font-bold mt-10">검색 결과가 없습니다.</div>
      ) : (
        boards.map((board, index) => <BoardCard board={board} index={index} />)
      )}
      <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
