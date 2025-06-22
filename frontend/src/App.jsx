import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as HotToaster } from 'react-hot-toast';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { useAuth } from "@clerk/clerk-react";

const queryClient = new QueryClient();

const App = () => {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <span className="loading loading-spinner loading-xl text-green-500"></span>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HotToaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!isSignedIn ? <Home /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/"/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;