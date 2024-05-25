import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import HomeScreen from './src/products/infrastructure/ui/screens/HomeScreen';
import ProductDetailScreen from './src/products/infrastructure/ui/screens/ProductDetailScreen';
import CartScreen from './src/cart/infrastructure/ui/screens/CartScreen';
import {useEffect} from 'react';
import {syncPendingOperations} from './src/shared/infrastructure/utils/sync';

export type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  ProductDetail: {productId: number};
};

export type HomeScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
export type ProductDetailScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;
export type CartScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'Cart'
>;

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const initialize = async () => {
      await syncPendingOperations();
    };

    initialize();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
