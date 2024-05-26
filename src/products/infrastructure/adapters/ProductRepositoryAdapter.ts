import {axiosInstance} from '../../../shared/infrastructure/api/apiConfig';
import {isConnected} from '../../../shared/infrastructure/utils/network';
import {getData, storeData} from '../../../shared/infrastructure/utils/storage';
import {
  PendingOperation,
  syncPendingOperations,
} from '../../../shared/infrastructure/utils/sync';
import IProductRepositoryPort from '../../application/ports/IProductRepositoryPort';
import ProductEntity from '../../domain/entities/ProductEntity';

class ProductRepositoryAdapter implements IProductRepositoryPort {
  async list(): Promise<ProductEntity[]> {
    const connectionStatus = await isConnected();

    console.log('Connection status:', connectionStatus);

    if (connectionStatus) {
      try {
        await syncPendingOperations(); // Sync pending operations on connection

        const response = await axiosInstance.get('/products');
        const products = response.data.data;

        // Store the data locally for offline access
        await storeData('products', products);

        return products.map((product: any) => {
          return new ProductEntity(
            product.id,
            product.title,
            product.image_url,
            product.description,
            product.price,
            product.stock,
          );
        });
      } catch (error) {
        console.error('Error fetching products', error);
        return [];
      }
    } else {
      // Retrieve data from local storage if offline
      const localData = await getData('products');
      if (localData) {
        return localData.map((product: any) => {
          return new ProductEntity(
            product.id,
            product.title,
            product.image_url,
            product.description,
            product.price,
            product.stock,
          );
        });
      }
      return [];
    }
  }

  async getById(id: number): Promise<ProductEntity | null> {
    const connectionStatus = await isConnected();

    console.log('Connection status:', connectionStatus);

    if (connectionStatus) {
      try {
        await syncPendingOperations(); // Sync pending operations on connection

        const response = await axiosInstance.get(`/products/${id}`);

        if (response.status === 404) {
          return null;
        }

        const product = response.data.data;

        // Store the data locally for offline access
        await storeData(`product_${id}`, product);

        return new ProductEntity(
          product.id,
          product.title,
          product.image_url,
          product.description,
          product.price,
          product.stock,
        );
      } catch (error) {
        console.error('Error fetching product', error);
        return null;
      }
    } else {
      // Retrieve data from local storage if offline
      const products = (await getData('products')) || [];
      const product = products.find((product: any) => product.id === id);
      if (product) {
        return new ProductEntity(
          product.id,
          product.title,
          product.image_url,
          product.description,
          product.price,
          product.stock,
        );
      }
      return null;
    }
  }

  async create(product: ProductEntity): Promise<void> {
    const connectionStatus = await isConnected();

    console.log('Connection status:', connectionStatus);

    if (connectionStatus) {
      try {
        await axiosInstance.post('/products', product);
      } catch (error) {
        console.error('Error creating product', error);
      }
    } else {
      // Offline handling: store the action locally
      const pendingOperations: PendingOperation[] =
        (await getData('pendingProductOperations')) || [];
      pendingOperations.push({
        type: 'create',
        product,
      });
      await storeData('pendingProductOperations', pendingOperations);
    }
  }

  async update(id: number, product: ProductEntity): Promise<void> {
    const connectionStatus = await isConnected();

    console.log('Connection status:', connectionStatus);

    if (connectionStatus) {
      try {
        await axiosInstance.put(`/products/${id}`, product);
      } catch (error) {
        console.error('Error updating product', error);
      }
    } else {
      // Offline handling: store the action locally
      const pendingOperations: PendingOperation[] =
        (await getData('pendingProductOperations')) || [];
      pendingOperations.push({
        type: 'update',
        id,
        product,
      });
      await storeData('pendingProductOperations', pendingOperations);
    }
  }

  async delete(id: number): Promise<void> {
    const connectionStatus = await isConnected();

    console.log('Connection status:', connectionStatus);

    if (connectionStatus) {
      try {
        await axiosInstance.delete(`/products/${id}`);
      } catch (error) {
        console.error('Error deleting product', error);
      }
    } else {
      // Offline handling: store the action locally
      const pendingOperations: PendingOperation[] =
        (await getData('pendingProductOperations')) || [];
      pendingOperations.push({
        type: 'delete',
        id,
      });
      await storeData('pendingProductOperations', pendingOperations);
    }
  }
}

export default ProductRepositoryAdapter;
