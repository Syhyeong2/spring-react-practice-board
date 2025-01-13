import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BoardSearchForm() {
  // 네비게이션 함수
  const navigate = useNavigate();
  // 검색 쿼리 상태
  const [searchQuery, setSearchQuery] = useState<string>("");
  // 검색 함수
  const handleSearch = () => {
    console.log(searchQuery);
    navigate(`/board/search/${searchQuery}`);
  };
  return (
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
  );
}
