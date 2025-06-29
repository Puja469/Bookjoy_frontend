import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from 'react-dom/client';
import "react-toastify/dist/ReactToastify.css";
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext";
import { InfoProvider } from './context/InfoContext';
import { ToastContainer } from "react-toastify";
import './index.css';
import "leaflet/dist/leaflet.css";



const queryClient = new QueryClient();

const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    
    <InfoProvider>
      <AuthProvider>
      
          {children}
       
      </AuthProvider>
    </InfoProvider>
   
  </QueryClientProvider>
);

createRoot(document.getElementById('root')).render(
  <Providers>
    
    <ToastContainer theme="dark"/>
    <App />
    
  </Providers>
);
