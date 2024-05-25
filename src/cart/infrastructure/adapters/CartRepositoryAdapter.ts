import ProductEntity from '../../../products/domain/entities/ProductEntity';
import {axiosInstance} from '../../../shared/infrastructure/api/apiConfig';
import ICartRepositoryPort from '../../application/ports/ICartRepositoryPort';
import CartEntity from '../../domain/entities/CartEntity';
import CartItemEntity from '../../domain/entities/CartItemEntity';

class CartRepositoryAdapter implements ICartRepositoryPort {
  async getCart(): Promise<CartEntity> {
    const response = await axiosInstance.get('/cart');

    const cart = response.data.data;
    const cartItems = cart.items.map((item: any) => {
      const productEntity = new ProductEntity(
        item.product.id,
        item.product.title,
        item.product.image_url,
        item.product.description,
        item.product.price,
        item.product.stock,
      );
      return new CartItemEntity(item.id, productEntity, item.quantity);
    });

    return new CartEntity(cart.id, cartItems);
  }

  async addProductToCart(productId: number, quantity: number): Promise<void> {
    console.log(`Adding product ${productId} to cart`);
    const response = await axiosInstance.post(
      `/cart?product_id=${productId}&quantity=${quantity}`,
    );
    console.log(`Product added was: ${response.data.success}`);
  }

  async removeProductFromCart(cartItemId: number): Promise<void> {
    await axiosInstance.delete(`/cart/${cartItemId}`);
  }

  async updateCartItem(cartItemId: number, quantity: number): Promise<void> {
    console.log(`Updating cart item ${cartItemId} to quantity ${quantity}`);
    await axiosInstance.put(`/cart/${cartItemId}?quantity=${quantity}`);
  }
}

export default CartRepositoryAdapter;
