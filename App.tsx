import React from 'react';
import {AuthProvider} from './src/app/providers/AuthContext';
import RootNavigator from './src/app/navigation/RootNavigator';
import {PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
