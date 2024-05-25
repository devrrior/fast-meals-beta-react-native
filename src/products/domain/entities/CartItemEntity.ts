import ProductEntity from './ProductEntity';

class CartItemEntity {
  id: string;
  product: ProductEntity;
  quantity: number;

  constructor(id: string, product: ProductEntity, quantity: number) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
  }
}

export default CartItemEntity;
