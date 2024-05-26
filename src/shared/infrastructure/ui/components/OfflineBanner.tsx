import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const OfflineBanner: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected =
        state.isConnected && (state.isInternetReachable ?? false);
      setIsConnected(connected || false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
