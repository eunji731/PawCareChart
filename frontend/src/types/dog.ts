/**
 * 백엔드 공통 응답 구조
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

/**
 * 반려견 정보 (응답용)
 */
export interface Dog {
  id: number;
  userId: number;
  name: string;
  breed: string | null;
  birthDate: string | null;
  weight: number | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 반려견 생성 요청 DTO
 */
export interface DogCreateRequest {
  name: string;
  breed: string | null;
  birthDate: string | null; // YYYY-MM-DD
  weight: number | null;
  profileImageUrl: string | null;
}

/**
 * 반려견 수정 요청 DTO
 */
export interface DogUpdateRequest extends DogCreateRequest {}
