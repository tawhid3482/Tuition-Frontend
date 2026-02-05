"use client";

import { store } from "@/src/redux/store";
import { Provider as ReduxProvider } from "react-redux";
// import AuthProvider from "./AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
