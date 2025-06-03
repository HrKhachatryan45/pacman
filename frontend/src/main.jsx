import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from "@react-oauth/google";
import {AuthContextProvider} from "./context/useAuthContext.jsx";
import {CurrentContextProvider} from "./context/useCurrentWorkspace.jsx";
import {SelectedRequestContextProvider} from "./context/useSelectedRequest.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthContextProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <CurrentContextProvider>
                    <SelectedRequestContextProvider>
                        <App/>
                    </SelectedRequestContextProvider>
              </CurrentContextProvider>
          </GoogleOAuthProvider>
      </AuthContextProvider>
  </StrictMode>,
)
