import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";
import { useEffect, useState } from "react";
import { IBoard } from "../types/BoardTypes";
import { searchBoard } from "../services/boardService";
import useErrorHandler from "../hooks/useErrorHandler";

export default function BoardSearch() {
  // 검색 키워드
  const { query } = useParams();
  // 토큰
  const { token } = useAuthStore();
  // 네비게이션 함수
  const navigate = useNavigate();
  // 게시판 데이터 상태
  const [boards, setBoards] = useState<IBoard[]>([]);
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
      // 게시판 데이터 패칭
      const response = await searchBoard(params.toString(), token);
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
    };
    fetchBoardData();
  }, [page]);
  console.log(boards);
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="text-2xl font-bold mt-24">BoardSearch : {query}</div>
      {boards.length === 0 ? (
        <div className="text-2xl font-bold mt-10">검색 결과가 없습니다.</div>
      ) : (
        boards.map((board, index) => (
          <div
            key={index}
            className="card w-96 bg-base-100 shadow-xl cursor-pointer"
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <div className="card-body">
              {/* 작성자 이름 */}
              <div className="card-text text-white text-xs">
                {board.user.username}
              </div>
              {/* 게시글 제목 */}
              <div className="card-title text-primary">{board.title}</div>
              {/* 게시글 내용 */}
              <div className="card-text text-white">{board.content}</div>
              {/* 게시글 작성 시간 */}
              <div className="card-actions justify-end text-xs text-gray-500">
                {new Date(board.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))
      )}
      <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
