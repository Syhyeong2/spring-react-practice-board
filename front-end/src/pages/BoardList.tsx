import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBoardList } from "../services/boardService";
import { IBoard } from "../types/BoardTypes";
import useErrorHandler from "../hooks/useErrorHandler";

export default function BoardList() {
  // 게시판 데이터 상태
  const [boards, setBoards] = useState<IBoard[]>([]);
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState<string>("");
  // 로그아웃 함수, 토큰을 전역 상태에서 가져옴
  const { token } = useAuthStore();
  // 네비게이션 함수
  const navigate = useNavigate();
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
      } else {
        // 에러 처리
        handleBoardError(response.status);
      }
    };
    // 패칭 함수 실행
    fetchBoardData();
  }, [page]); // 의존성 배열에 필요한 값

  const handleSearch = () => {
    console.log(searchQuery);
    navigate(`/board/search/${searchQuery}`);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="text-2xl font-bold mt-24">BoardList</div>
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        {/* 게시판 데이터 매핑 */}
        {boards.map((board, index) => (
          <div
            key={index}
            className="card w-96 bg-base-100 shadow-xl cursor-pointer border-2 border-gray-700"
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
        ))}
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
