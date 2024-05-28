import {View, Text, StyleSheet} from 'react-native';
import useNetwork from '../../hooks/useNetwork';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

const OfflineBanner = () => {
  useNetwork();

  const isConnected = useSelector(
    (state: RootState) => state.network.isConnected,
  );

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 10,
    paddingBottom: 20, // Add more padding bottom here
    zIndex: 1,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default OfflineBanner;
