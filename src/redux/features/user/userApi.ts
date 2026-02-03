import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAuth: builder.mutation({
      query: (formData) => {
        return {
          url: "/auth/register",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.user],
    }),


    getAllUser: builder.query({
      query: () => ({
        url: `/user/allUsers`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

  }),
});

export const {
  useCreateAuthMutation,
  useGetAllUserQuery,

} = authApi;
