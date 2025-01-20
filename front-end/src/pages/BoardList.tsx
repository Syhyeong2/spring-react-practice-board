import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBoardList } from "../services/boardService";
import { IBoard } from "../types/BoardTypes";
import useErrorHandler from "../hooks/useErrorHandler";
import BoardCard from "../components/BoardCard";
import BoardCardSkeleton from "../components/BoardCardSkeleton";
import { BoardSearchForm } from "../components/BoardSearchForm";

export default function BoardList() {
  // 게시판 데이터 상태
  const [boards, setBoards] = useState<IBoard[]>([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 관찰 대상 요소
  const observerTarget = useRef<HTMLDivElement | null>(null);
  // 에러 처리 커스텀 훅
  const { handleBoardError } = useErrorHandler();
  // 페이지 상태
  const [page, setPage] = useState(0);
  // 더 많은 데이터가 있는지 여부
  const [hasMore, setHasMore] = useState(true);
  // 파라미터
  const params = new URLSearchParams({
    page: (page - 1).toString(),
    size: "10",
  });

  // 게시판 데이터 가져오기
  const fetchBoardData = useCallback(async () => {
    // 로딩 상태 업데이트
    setIsLoading(true);
    // 게시판 데이터 패칭
    const response = await getBoardList(params.toString());
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
      // 더 많은 데이터가 있는지 여부 업데이트
      if (response.data?.last) {
        setHasMore(false);
      }
    } else {
      // 에러 처리
      handleBoardError(response.status);
    }
  }, [page]);

  // 페이지 변경 시 게시판 데이터 가져오기
  useEffect(() => {
    // 페이지가 0보다 클 때 게시판 데이터 가져오기
    if (page > 0) {
      fetchBoardData();
    }
  }, [fetchBoardData, page]);

  // Intersection Observer 콜백
  const onIntersect = useCallback(
    // 교차 관찰 콜백
    (entries: IntersectionObserverEntry[]) => {
      // 교차 관찰 대상 요소
      const target = entries[0];
      // 교차 관찰 대상 요소가 보이고 더 많은 데이터가 있을 때
      if (target.isIntersecting && hasMore) {
        // 다음 페이지로 넘어가며 fetchMoreItems() 실행
        setPage((prevPage) => prevPage + 1);
      }
    },
    // 더 많은 데이터가 있는지 여부
    [hasMore]
  );

  // observer를 등록 및 해제
  useEffect(() => {
    // 교차 관찰 객체
    let observer: IntersectionObserver | undefined;
    // 교차 관찰 대상 요소가 존재할 때
    if (observerTarget.current) {
      // 교차 관찰 객체 생성
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.1, // 10% 정도 보일 때 콜백 실행
      });
      observer.observe(observerTarget.current);
    }
    // 교차 관찰 객체 해제
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observerTarget, onIntersect]);

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="text-2xl font-bold mt-24">BoardList</div>
      {/* 게시글 작성 버튼 */}
      <div className="flex flex-col items-center justify-center gap-5">
        <Link to="/board/write" className="btn btn-primary">
          Write
        </Link>
        <BoardSearchForm />
        {/* 게시판 데이터 매핑 */}
        {boards.map((board, index) => (
          <BoardCard board={board} index={index} key={index} />
        ))}
        {isLoading &&
          [...Array(10)].map((_, index) => <BoardCardSkeleton key={index} />)}
      </div>
      {/* 게시글 작성 버튼 */}
      <div className="flex flex-row gap-10">
        {/* <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
          Next
        </button> */}
        <div ref={observerTarget} className="h-4 "></div>
      </div>
    </div>
  );
}
