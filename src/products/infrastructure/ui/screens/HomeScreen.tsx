import {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {listProductsUseCase} from '../../dependecies';
import ProductEntity from '../../../domain/entities/ProductEntity';
import AppBar from '../../../../shared/infrastructure/ui/components/AppBar';
import {HomeScreenRouteProp} from '../../../../../App';

const HomeScreen = ({navigation}: HomeScreenRouteProp) => {
  const [products, setProducts] = useState([] as ProductEntity[]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsResponse = await listProductsUseCase.execute();
      setProducts(productsResponse);
    };

    fetchProducts();
  }, []);

  return (
    <SafeAreaView>
      <AppBar title="Productos" />
      {/* checa si hay internet */}
      {/* <OfflineBanner /> */}
      <ScrollView>
        <View style={styles.container}>
          {products.map((product: ProductEntity) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productContainer}
              onPress={() =>
                navigation.navigate('ProductDetail', {productId: product.id})
              }>
              <Image
                source={{uri: product.imageURL}}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{product.title}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  productContainer: {
    width: windowWidth / 2 - 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginTop: 8,
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

export default HomeScreen;
