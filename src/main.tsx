import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {AblyProvider} from "ably/react";
import client from "./ably.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AblyProvider client={client}>
      <BrowserRouter basename={process.env.NODE_ENV === 'production' ? 'scrumgif' : '/'}>
        <App/>
      </BrowserRouter>
    </AblyProvider>
  </StrictMode>
)
