import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const CategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (formData) => {
        return {
          url: "/categories/create",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.TutorRequest],
    }),


    getAllCategory: builder.query({
      query: () => ({
        url: `/categories`,
        method: "GET",
      }),
      providesTags: [tagTypes.TutorRequest],
    }),

  }),
});

export const {
useCreateCategoryMutation,
useGetAllCategoryQuery 

} = CategoryApi;
