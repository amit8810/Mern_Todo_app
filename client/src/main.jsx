import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Todo from "./pages/Todo";
import { AuthProvider } from "./context/Auth";
import { UserProvider } from "./context/User";
import { GlobalProvider } from "./context/Global";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <UserProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/todos" element={<Todo />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </UserProvider>
    </GlobalProvider>
  </React.StrictMode>
);
