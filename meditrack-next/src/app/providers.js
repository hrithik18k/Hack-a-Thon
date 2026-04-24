"use client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "../redux/store";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <Toaster />
      {children}
    </Provider>
  );
}
