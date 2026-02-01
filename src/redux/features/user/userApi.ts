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
      invalidatesTags: [tagTypes.auth],
    }),


    getAllUsers: builder.query({
      query: () => ({
        url: "/auth/users",
        method: "GET",
      }),
      providesTags: [tagTypes.auth],
    }),

    getMYInfo: builder.query({
      query: (id: string) => ({
        url: `/auth/me/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.auth],
    }),

  }),
});

export const {
  useCreateAuthMutation,
  useGetAllUsersQuery,

} = authApi;
