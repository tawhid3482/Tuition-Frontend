// src/redux/features/notification/notificationApi.ts
import { baseApi } from "../../api/baseApi";

const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    SaveFcmToken: builder.mutation({
      query: ({ userId, token, platform }) => { // ✅ userId, token, platform সরাসরি নিন
        return {
          url: `/notification/save-token/${userId}`, // ✅ URL-এ userId ব্যবহার করুন
          method: "POST",
          data: { token, platform }, // ✅ data object তৈরি করুন
        };
      },
    }),
  }),
});

export const { useSaveFcmTokenMutation } = NotificationApi;