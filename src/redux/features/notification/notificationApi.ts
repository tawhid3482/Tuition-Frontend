import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

type SaveTokenPayload = {
  token: string;
  platform?: "web" | "android" | "ios";
};

const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    SaveFcmToken: builder.mutation<unknown, SaveTokenPayload>({
      query: ({ token, platform }) => ({
        url: "/notification/save-token",
        method: "POST",
        data: { token, platform },
      }),
      invalidatesTags: [tagTypes.notification],
    }),

    GetUserNotifications: builder.query<unknown, void>({
      query: () => ({
        url: "/notification/user",
        method: "GET",
      }),
      providesTags: [tagTypes.notification],
    }),

    MarkNotificationAsRead: builder.mutation<unknown, string>({
      query: (userNotificationId) => ({
        url: `/notification/read/${userNotificationId}`,
        method: "PUT",
      }),
      invalidatesTags: [tagTypes.notification],
    }),

    SyncPendingNotifications: builder.mutation<unknown, void>({
      query: () => ({
        url: "/notification/sync",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
  }),
});

export const {
  useSaveFcmTokenMutation,
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useSyncPendingNotificationsMutation,
} = NotificationApi;
