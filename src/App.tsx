import { AuthProvider } from './hooks/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </AuthProvider>
  );
}