import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BoardSearchForm() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

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
