export interface IBoardListResponse {
  content: IBoard[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IBoardDetailResponse {
  board: IBoard;
}

export interface IBoard {
  id: number;
  title: string;
  content: string;
  hit: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
  };
}

export interface IBoardWriteRequest {
  title: string;
  content: string;
}
