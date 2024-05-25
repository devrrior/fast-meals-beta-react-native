import {axiosInstance} from '../../../shared/infrastructure/api/apiConfig';

import {isConnected} from './network';
import {getData, removeData} from './storage';

export interface PendingOperation {
  type: 'add' | 'remove' | 'update' | 'create' | 'delete';
  productId?: number;
  cartItemId?: number;
  quantity?: number;
  id?: number;
  product?: any;
}

export const syncPendingOperations = async (): Promise<void> => {
  const connectionStatus = await isConnected();

  if (connectionStatus) {
    const pendingCartOperations: PendingOperation[] =
      (await getData('pendingCartOperations')) || [];
    const pendingProductOperations: PendingOperation[] =
      (await getData('pendingProductOperations')) || [];

    for (const operation of pendingCartOperations) {
      try {
        switch (operation.type) {
          case 'add':
            if (
              operation.productId !== undefined &&
              operation.quantity !== undefined
            ) {
              await axiosInstance.post(
                `/cart?product_id=${operation.productId}&quantity=${operation.quantity}`,
              );
            }
            break;
          case 'remove':
            if (operation.cartItemId !== undefined) {
              await axiosInstance.delete(`/cart/${operation.cartItemId}`);
            }
            break;
          case 'update':
            if (
              operation.cartItemId !== undefined &&
              operation.quantity !== undefined
            ) {
              await axiosInstance.put(
                `/cart/${operation.cartItemId}?quantity=${operation.quantity}`,
              );
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error syncing cart operation ${operation.type}`, error);
      }
    }

    for (const operation of pendingProductOperations) {
      try {
        switch (operation.type) {
          case 'create':
            if (operation.product) {
              await axiosInstance.post('/products', operation.product);
            }
            break;
          case 'update':
            if (operation.id !== undefined && operation.product) {
              await axiosInstance.put(
                `/products/${operation.id}`,
                operation.product,
              );
            }
            break;
          case 'delete':
            if (operation.id !== undefined) {
              await axiosInstance.delete(`/products/${operation.id}`);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(
          `Error syncing product operation ${operation.type}`,
          error,
        );
      }
    }

    // Clear pending operations after successful sync
    await removeData('pendingCartOperations');
    await removeData('pendingProductOperations');
  }
};
