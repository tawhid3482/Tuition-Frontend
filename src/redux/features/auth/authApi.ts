import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (formData) => {
        return {
          url: "/auth/login",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.auth],
    }),

    LogOut: builder.mutation({
      query: () => {
        return {
          url: "/auth/logout",
          method: "POST",
        };
      },
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
      query: (formData) => {
        return {
          url: "/auth/send-otp",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.auth],
    }),
    verifyOtp: builder.mutation({
      query: (formData) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.auth],
    }),
    resendOtp: builder.mutation({
      query: (formData) => {
        return {
          url: "/auth/resend-otp",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.auth],
    }),

    changePassword: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/auth/change-password/${id}`,
          method: "PATCH",
          data: data,
        };
      },
      invalidatesTags: [tagTypes.auth],
    }),
    forgetPassword: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/auth/forget-password`,
          method: "PATCH",
          data: data,
        };
      },
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
  useLogOutMutation,
  useGetSessionQuery,
} = authApi;
