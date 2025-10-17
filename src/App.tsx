
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Toaster richColors={true}  position="top-right" />
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
