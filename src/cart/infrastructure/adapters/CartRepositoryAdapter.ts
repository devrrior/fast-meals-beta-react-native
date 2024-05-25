import ProductEntity from '../../../products/domain/entities/ProductEntity';
import {axiosInstance} from '../../../shared/infrastructure/api/apiConfig';
import {isConnected} from '../../../shared/infrastructure/utils/network';
import {getData, storeData} from '../../../shared/infrastructure/utils/storage';
import {
  PendingOperation,
  syncPendingOperations,
} from '../../../shared/infrastructure/utils/sync';
import ICartRepositoryPort from '../../application/ports/ICartRepositoryPort';
import CartEntity from '../../domain/entities/CartEntity';
import CartItemEntity from '../../domain/entities/CartItemEntity';

class CartRepositoryAdapter implements ICartRepositoryPort {
  async getCart(): Promise<CartEntity> {
    const connectionStatus = await isConnected();

    console.log('Connection status:', connectionStatus);

    if (connectionStatus) {
      try {
        await syncPendingOperations(); // Sync pending operations on connection

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

        // Store the data locally for offline access
        await storeData('cart', {id: cart.id, items: cartItems});

        return new CartEntity(cart.id, cartItems);
      } catch (error) {
        console.error('Error fetching cart', error);
        return new CartEntity(0, []);
      }
    } else {
      // Retrieve data from local storage if offline
      const localData = await getData('cart');
      if (localData) {
        const cartItems = localData.items.map((item: any) => {
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
        return new CartEntity(localData.id, cartItems);
      }
      return new CartEntity(0, []);
    }
  }

  async addProductToCart(productId: number, quantity: number): Promise<void> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      try {
        const response = await axiosInstance.post(
          `/cart?product_id=${productId}&quantity=${quantity}`,
        );
        console.log(`Product added: ${response.data.success}`);
      } catch (error) {
        console.error('Error adding product to cart', error);
      }
    } else {
      // Offline handling: store the action and update local storage
      const cart = await this.getCart();
      const product = new ProductEntity(productId, '', '', '', 0, 0); // Placeholder product
      const cartItem = new CartItemEntity(Date.now(), product, quantity);
      cart.items.push(cartItem);

      await storeData('cart', cart);

      // Store pending operation
      const pendingOperations: PendingOperation[] =
        (await getData('pendingCartOperations')) || [];
      pendingOperations.push({
        type: 'add',
        productId,
        quantity,
      });
      await storeData('pendingCartOperations', pendingOperations);
    }
  }

  async removeProductFromCart(cartItemId: number): Promise<void> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      try {
        await axiosInstance.delete(`/cart/${cartItemId}`);
      } catch (error) {
        console.error('Error removing product from cart', error);
      }
    } else {
      // Offline handling: store the action and update local storage
      const cart = await this.getCart();
      const updatedItems = cart.items.filter(item => item.id !== cartItemId);
      cart.items = updatedItems;

      await storeData('cart', cart);

      // Store pending operation
      const pendingOperations: PendingOperation[] =
        (await getData('pendingCartOperations')) || [];
      pendingOperations.push({
        type: 'remove',
        cartItemId,
      });
      await storeData('pendingCartOperations', pendingOperations);
    }
  }

  async updateCartItem(cartItemId: number, quantity: number): Promise<void> {
    const connectionStatus = await isConnected();

    if (connectionStatus) {
      try {
        await axiosInstance.put(`/cart/${cartItemId}?quantity=${quantity}`);
      } catch (error) {
        console.error('Error updating cart item', error);
      }
    } else {
      // Offline handling: store the action and update local storage
      const cart = await this.getCart();
      const itemIndex = cart.items.findIndex(item => item.id === cartItemId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;

        await storeData('cart', cart);

        // Store pending operation
        const pendingOperations: PendingOperation[] =
          (await getData('pendingCartOperations')) || [];
        pendingOperations.push({
          type: 'update',
          cartItemId,
          quantity,
        });
        await storeData('pendingCartOperations', pendingOperations);
      }
    }
  }
}

export default CartRepositoryAdapter;
