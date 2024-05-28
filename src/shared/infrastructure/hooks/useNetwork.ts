// useNetwork.ts
import {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {setIsConnected} from '../store/networkSlice';
import {AppDispatch} from '../store/store';

const useNetwork = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected;
      dispatch(setIsConnected(connected as boolean));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
};

export default useNetwork;
