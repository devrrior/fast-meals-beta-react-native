import ProductEntity from '../../../products/domain/entities/ProductEntity';

class CartItemEntity {
  id: number;
  product: ProductEntity;
  quantity: number;

  constructor(id: number, product: ProductEntity, quantity: number) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
  }
}

export default CartItemEntity;
