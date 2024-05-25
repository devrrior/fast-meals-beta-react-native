import {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  deleteProductFromCartUseCase,
  getCartUseCase,
  updateCartItemUseCase,
} from '../../dependecies';
import CartEntity from '../../../domain/entities/CartEntity';
import {CartScreenRouteProp} from '../../../../../App';
import AppBar from '../../../../shared/infrastructure/ui/components/AppBar';
import CartItemEntity from '../../../domain/entities/CartItemEntity';
import {useNetInfoInstance} from '@react-native-community/netinfo';

const CartScreen = ({}: CartScreenRouteProp) => {
  const [cart, setCart] = useState({} as CartEntity | null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    netInfo: {type, isConnected},
    refresh,
  } = useNetInfoInstance();

  useEffect(() => {
    const fetchData = async () => {
      const cartResponse = await getCartUseCase.execute();
      console.log(cartResponse);
      setCart(cartResponse);
      setIsLoading(false);
    };

    fetchData();
  }, [isConnected]);

  return (
    <SafeAreaView style={styles.container}>
      <AppBar title="Carrito" />
      {!isConnected && (
        <View style={styles.noInternetContainer}>
          <Text style={styles.noInternetText}>
            No tienes conexión a internet
          </Text>
          <TouchableOpacity onPress={refresh}>
            <Text style={styles.refreshText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      )}
      {isConnected && (
        <View style={styles.content}>
          {isLoading ? (
            <Text style={styles.loadingText}>Cargando...</Text>
          ) : (
            <>
              {cart?.items.map((item: CartItemEntity) => (
                <View key={item.product.id} style={styles.itemContainer}>
                  <Image
                    source={{uri: item.product.imageURL}}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.product.title}</Text>
                    <Text style={styles.itemPrice}>
                      Precio: ${item.product.price}
                    </Text>
                    <Text style={styles.itemQuantity}>
                      Cantidad: {item.quantity} unidades
                    </Text>
                  </View>
                  <View style={styles.itemButtons}></View>
                  <Button
                    title="+"
                    onPress={async () => {
                      await updateCartItemUseCase.execute(
                        item.id,
                        item.quantity + 1,
                      );

                      const cartResponse = await getCartUseCase.execute();
                      setCart(cartResponse);
                    }}
                  />
                  <Button
                    title="-"
                    onPress={async () => {
                      await updateCartItemUseCase.execute(
                        item.id,
                        item.quantity - 1,
                      );

                      const cartResponse = await getCartUseCase.execute();
                      setCart(cartResponse);
                    }}
                  />
                  <Button
                    title="Eliminar"
                    onPress={async () => {
                      await deleteProductFromCartUseCase.execute(item.id);

                      const cartResponse = await getCartUseCase.execute();
                      setCart(cartResponse);
                    }}
                  />
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noInternetContainer: {
    padding: 16,
    backgroundColor: '#f44336',
  },
  noInternetText: {
    color: 'white',
    fontWeight: 'bold',
  },
  refreshText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default CartScreen;
