import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthUserProvider } from '@/contexts/auth_user.context';
import { useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const MyApp = function ({ Component, pageProps }: AppProps) {
  const queryClient = useRef<QueryClient>();
  if (!queryClient.current) {
    queryClient.current = new QueryClient();
  }
  return (
    <QueryClientProvider client={queryClient.current}>
      <ChakraProvider>
        <AuthUserProvider>
          <Component {...pageProps} />
        </AuthUserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
