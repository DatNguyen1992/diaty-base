/**
 * Generic pagination response shape.
 * `items` – the slice of data for the requested page.
 * `page` – current page number.
 * `pageSize` – number of items requested per page.
 * `totalItems` – total amount of items in the full collection.
 * `totalPages` – total pages available.
 * `hasReachedEnd` – true when the current page is the last one.
 */
export interface PaginationResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasReachedEnd: boolean;
}