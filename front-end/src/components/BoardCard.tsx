import { useNavigate } from "react-router-dom";
import { IBoard } from "../types/BoardTypes";

export default function BoardCard({
  board,
  index,
}: {
  board: IBoard;
  index: number;
}) {
  const navigate = useNavigate();
  return (
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
        <div className="card-text text-white text-pretty">{board.content}</div>
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
  );
}
