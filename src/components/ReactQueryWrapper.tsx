'use client';
import type { ReactNode } from 'react'; // Use 'type' for types only
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

type ReactQueryWrapperProps = {
  children: ReactNode;
};
const ReactQueryWrapper: React.FC<ReactQueryWrapperProps> = ({ children }) => {
  const [queryClient] = useState(new QueryClient()); // Initialize the QueryClient on the client
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
export default ReactQueryWrapper;
