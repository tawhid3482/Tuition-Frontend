"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/src/redux/slices/authSlice";
import { useGetSessionQuery } from "@/src/redux/features/auth/authApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useGetSessionQuery(undefined);

  // console.log("AuthProvider - Session Data:", data?.data?.isAuthenticated, data?.data?.user);

  useEffect(() => {
    if (isSuccess) {
      if (data?.data?.isAuthenticated) {
        dispatch(setUser(data?.data?.user));
      } else {
        dispatch(clearUser());
      }
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return <>{children}</>;
}
