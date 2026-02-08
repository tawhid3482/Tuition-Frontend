
import { baseApi } from "../../api/baseApi";

const NotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    SaveFcmToken: builder.mutation({
      query: ({ userId, token, platform }) => ({
        url: `/notification/save-token/${userId}`,
        method: "POST",
        data: { token, platform },
      }),
    }),
    
    // ✅ নতুন API endpoints
    GetUserNotifications: builder.query({
      query: (userId) => ({
        url: `/notification/user/${userId}`,
        method: "GET",
      }),
    }),
    
    MarkNotificationAsRead: builder.mutation({
      query: (userNotificationId) => ({
        url: `/notification/read/${userNotificationId}`,
        method: "PUT",
      }),
    }),
    
    SyncPendingNotifications: builder.mutation({
      query: ({ userId }) => ({
        url: `/notification/sync/${userId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { 
  useSaveFcmTokenMutation, 
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useSyncPendingNotificationsMutation 
} = NotificationApi;