import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import "./index.css";
import { PlayerProvider } from "./contexts/PlayerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <App />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#1db954',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
