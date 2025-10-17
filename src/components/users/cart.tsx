export interface Item {
  productId: any;
  quantity: number;
  varientId: any;
}

export interface Cart {
  userId: string;
  products: Item[];
}

