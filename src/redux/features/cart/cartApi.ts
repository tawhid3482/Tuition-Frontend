import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const CartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (formData) => {
        return {
          url: "/cart/add",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.categories],
    }),


    getAllCart: builder.query({
      query: () => ({
        url: `/cart/me`,
        method: "GET",
      }),
      providesTags: [tagTypes.categories],
    }),

  }),
});

export const {
useCreateCartMutation,
useGetAllCartQuery 

} = CartApi;
