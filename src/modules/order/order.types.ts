export interface CreateOrderItemRequest {
  bookId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
}
