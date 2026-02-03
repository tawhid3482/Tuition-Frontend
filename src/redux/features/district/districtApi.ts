import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const DistrictApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDistrict: builder.mutation({
      query: (formData) => {
        return {
          url: "/district/create",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.district],
    }),


    getAllDistrict: builder.query({
      query: () => ({
        url: `/district`,
        method: "GET",
      }),
      providesTags: [tagTypes.district],
    }),

  }),
});

export const {
  useCreateDistrictMutation,
  useGetAllDistrictQuery,

} = DistrictApi;
