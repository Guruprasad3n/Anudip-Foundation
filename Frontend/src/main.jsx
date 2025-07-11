import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

// ✅ Register the Service Worker after the app loads
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}



// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "./ThemeContext.jsx";

// createRoot(document.getElementById("root")).render(

//   <StrictMode>
//     <ThemeProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </ThemeProvider>
//   </StrictMode>
// );
