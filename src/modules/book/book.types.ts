// Request types
export interface CreateBookRequest {
  title: string;
  author: string;
  price: number;
  stock?: number;
  description: string | null;
  coverImage: string | null;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  price?: number;
  stock?: number;
  description: string | null;
  coverImage: string | null;
}

// Response types
export interface BookResponse {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string | null;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BooksListResponse {
  books: BookResponse[];
  count: number;
}
