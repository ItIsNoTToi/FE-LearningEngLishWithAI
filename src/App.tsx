import { AuthProvider } from './hooks/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Khởi tạo 1 client React Query
const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </Provider>
    </AuthProvider>
  );
}
