import React, {useEffect, useState} from 'react';
import {Text, View, Image, Button, StyleSheet} from 'react-native';
import {ProductDetailScreenRouteProp} from '../../../../../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getByIdProductUseCase} from '../../dependecies';
import ProductEntity from '../../../domain/entities/ProductEntity';
import AppBar from '../../../../shared/infrastructure/ui/components/AppBar';
import {addProductToCartUseCase} from '../../../../cart/infrastructure/dependecies';

const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenRouteProp) => {
  const {productId} = route.params;
  const [product, setProduct] = useState({} as ProductEntity | null);

  useEffect(() => {
    const fetchData = async () => {
      const productResponse = await getByIdProductUseCase.execute(productId);
      setProduct(productResponse);
    };

    fetchData();
  }, [productId]);

  const addToCart = async () => {
    await addProductToCartUseCase.execute(productId, 1);
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView>
      <AppBar title="Detalle del producto" />
      <View style={styles.content}>
        <Image source={{uri: product?.imageURL}} style={styles.image} />
        <Text style={styles.title}>{product?.title}</Text>
        <Text style={styles.description}>{product?.description}</Text>
        <Text style={styles.price}>${product?.price}</Text>
        <Button title="Agregar al carrito" onPress={addToCart} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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

export default ProductDetailScreen;
