import CartEntity from '../../domain/entities/CartEntity';

interface ICartRepositoryPort {
  addProductToCart(productId: number, quantity: number): Promise<void>;
  getCart(): Promise<CartEntity>;
  removeProductFromCart(cartItemId: number): Promise<void>;
  updateCartItem(cartItemId: number, quantity: number): Promise<void>;
}

export default ICartRepositoryPort;
