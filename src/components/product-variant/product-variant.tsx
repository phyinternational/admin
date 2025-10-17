interface ProductVariant {
  productId: string;
  _id: string;
  size: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  color?: string | any;
  isActive?: boolean;
  imageUrls: string[];
}

export default ProductVariant;
