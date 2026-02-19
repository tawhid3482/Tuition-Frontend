import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    LogOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    getSession: builder.query({
      query: () => ({
        url: "/auth/session",
        method: "GET",
      }),
      providesTags: [tagTypes.auth],
    }),

    sendOtp: builder.mutation({
      query: (formData) => ({
        url: "/auth/send-otp",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    verifyOtp: builder.mutation({
      query: (formData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    resendOtp: builder.mutation({
      query: (formData) => ({
        url: "/auth/resend-otp",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useLogOutMutation,
  useGetSessionQuery,
} = authApi;
