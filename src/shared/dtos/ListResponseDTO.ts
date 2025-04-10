export interface ListResponseDTO<T> {
  items: T[];
  total: number;
  totalPages: number;
}
