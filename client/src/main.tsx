import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router";
import "./index.css";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Checkout from "./pages/Checkout.tsx";
import PaymentSuccessful from "./pages/PaymentSuccessful.tsx";
import PaymentFailed from "./pages/PaymentFailed.tsx";
import Profile from "./pages/Profile.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<PaymentSuccessful />} />
      <Route path="/failure" element={<PaymentFailed />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
