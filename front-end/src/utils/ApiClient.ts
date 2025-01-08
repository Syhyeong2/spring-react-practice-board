// 서버 응답 타입
export interface ApiResponse<T> {
  // 상태 코드
  status: number;
  // 성공 여부
  success: boolean;
  // 성공시 데이터
  data?: T;
  // 실패시 오류 객체
  error?: {
    errorText: string;
    message: string;
    path: string;
    timestamp: string;
  };
}

// 서버 통신 함수
async function apiClient<T>(
  // 요청 정보
  input: RequestInfo,
  // 요청 옵션
  init?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    // 서버 통신
    const response = await fetch(input, init);
    const { status } = response;

    // 응답이 성공(2xx)이 아닐 경우
    if (!response.ok) {
      // JSON으로 보내진 에러 객체를 처리
      const errorBody = await safeJsonParse(response);
      return {
        // 오류 상태 코드
        status: errorBody?.status ?? status,
        // 실패 여부
        success: false,
        // 오류 객체
        error: {
          errorText: errorBody?.errorText ?? "Unknown Error",
          message: errorBody?.message ?? "Request failed",
          path: errorBody?.path ?? input.toString(),
          timestamp: errorBody?.timestamp ?? new Date().toISOString(),
        },
      };
    }

    // 201 (Created) or 204 (No Content)의 경우 → data 없이 성공 처리
    if (status === 201 || status === 204) {
      return {
        status,
        success: true,
      };
    }

    // 그 외 2xx (200, 202, 206 등)일 경우 → JSON 데이터 파싱
    const data = await safeJsonParse(response);
    return {
      status,
      success: true,
      data: data as T,
    };
  } catch (error: any) {
    // fetch 자체 실패 (네트워크 에러, CORS, 등)
    console.error(error);
    return {
      status: 500,
      success: false,
      error: {
        errorText: "API fetch failed",
        message: error.message ?? "API fetch failed",
        path: input.toString(),
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export default apiClient;

// 안전하게 JSON 파싱을 시도하는 함수
async function safeJsonParse(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
