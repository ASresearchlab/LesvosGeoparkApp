import React, {useEffect} from 'react';
import i18n from 'i18next';
import {enableScreens} from 'react-native-screens';
import {initReactI18next} from 'react-i18next';
import {persist, store} from '@store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Setting} from '@configs';
import AppContainer from './container';

enableScreens(true);

export default function App() {
  /**
   * setup init language
   */
  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: Setting.resourcesLanguage,
      lng: Setting.defaultLanguage,
      fallbackLng: Setting.defaultLanguage,
      compatibilityJSON: 'v3',
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
}
