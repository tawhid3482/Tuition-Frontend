import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const WishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWishlist: builder.mutation({
      query: (formData) => {
        return {
          url: "/wishlist/add",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.categories],
    }),


    getAllWishlist: builder.query({
      query: () => ({
        url: `/wishlist/me`,
        method: "GET",
      }),
      providesTags: [tagTypes.categories],
    }),

  }),
});

export const {
useCreateWishlistMutation,
useGetAllWishlistQuery 

} = WishlistApi;
