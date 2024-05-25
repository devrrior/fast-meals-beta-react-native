import CartItemEntity from './CartItemEntity';

class CartEntity {
  id: number;
  items: CartItemEntity[];

  constructor(id: number, items: CartItemEntity[]) {
    this.id = id;
    this.items = items;
  }
}

export default CartEntity;
