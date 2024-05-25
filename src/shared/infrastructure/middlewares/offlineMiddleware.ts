// middlewares/offlineMiddleware.ts
import {Middleware} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {setConnectionStatus} from '../redux/actions/connectionActions';

const offlineMiddleware: Middleware = store => next => async action => {
  const state = store.getState();

  if (!state.connection.isConnected) {
    const pendingActions = JSON.parse(
      (await AsyncStorage.getItem('pendingActions')) || '[]',
    );
    pendingActions.push(action);
    await AsyncStorage.setItem(
      'pendingActions',
      JSON.stringify(pendingActions),
    );
    return;
  }

  next(action);

  NetInfo.addEventListener(async state => {
    if (state.isConnected) {
      store.dispatch(setConnectionStatus(true));
      const pendingActions = JSON.parse(
        (await AsyncStorage.getItem('pendingActions')) || '[]',
      );
      for (let pendingAction of pendingActions) {
        store.dispatch(pendingAction);
      }
      await AsyncStorage.removeItem('pendingActions');
    } else {
      store.dispatch(setConnectionStatus(false));
    }
  });
};

export default offlineMiddleware;
