import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface AppBarProps {
  title: string;
}

const AppBar = ({title}: AppBarProps) => {
  const navigation = useNavigation();

  const handleCartPress = () => {
    // Navigate to the cart screen
    // Add your navigation logic here
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={handleCartPress}>
        <Text style={styles.cartText}>Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#f2f2f2',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppBar;
