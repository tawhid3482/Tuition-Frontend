import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
 signupUser: builder.mutation({
      query: (formData) => {
        return {
          url: "/user/signup",
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
  useSignupUserMutation,
  useGetAllUserQuery,

} = authApi;
