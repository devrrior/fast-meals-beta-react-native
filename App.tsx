import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import HomeScreen from './src/products/infrastructure/ui/screens/HomeScreen';
import ProductDetailScreen from './src/products/infrastructure/ui/screens/ProductDetailScreen';
import CartScreen from './src/cart/infrastructure/ui/screens/CartScreen';
import {Text, View} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {setConnectionStatus} from './src/shared/infrastructure/redux/actions/connectionActions';
import {addEventListener} from '@react-native-community/netinfo';
import {persistor, store} from './src/shared/infrastructure/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

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

export const OfflineBanner = () => {
  const isConnected = useSelector((state: any) => state.connection.isConnected);

  if (!isConnected) {
    return (
      <View style={{backgroundColor: 'red', padding: 10}}>
        <Text style={{color: 'white'}}>No hay conexión a internet</Text>
      </View>
    );
  }

  return null;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      if (state.isConnected !== null) {
        dispatch(setConnectionStatus(state.isConnected));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PersistGate>
  );
};

export default App;
