"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import store from "../redux/store";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "";
axios.defaults.withCredentials = true;

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <Toaster />
      {children}
    </Provider>
  );
}
