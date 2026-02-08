import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const TutorRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTutorRequest: builder.mutation({
      query: (formData) => {
        return {
          url: "/tutor-jobs/create",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.TutorRequest],
    }),


    getAllTutorRequest: builder.query({
      query: () => ({
        url: `/tutor-jobs`,
        method: "GET",
      }),
      providesTags: [tagTypes.TutorRequest],
    }),

  }),
});

export const {
 useCreateTutorRequestMutation,
 

} = TutorRequestApi;
