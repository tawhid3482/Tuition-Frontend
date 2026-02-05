import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";

export const reducer = {
  auth: authReducer, // 🔥 THIS LINE FIXES EVERYTHING
  [baseApi.reducerPath]: baseApi.reducer,
};
