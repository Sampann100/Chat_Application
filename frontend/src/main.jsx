import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import chat_app_store from "../store/index.js";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={chat_app_store}>
      <HelmetProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
