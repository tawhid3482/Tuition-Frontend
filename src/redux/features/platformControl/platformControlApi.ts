import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const platformControlApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addSubjects: builder.mutation({
      query: (formData) => {
        return {
          url: "/platform-control/add-subject",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.platformControl],
    }),

    addMediums: builder.mutation({
      query: (formData) => {
        return {
          url: "/platform-control/add-medium",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.platformControl],
    }),
    addClasses: builder.mutation({
      query: (formData) => {
        return {
          url: "/platform-control/add-classes",
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: [tagTypes.platformControl],
    }),


    getAllClasses: builder.query({
      query: () => ({
        url: `/platform-control/get-classes`,
        method: "GET",
      }),
      providesTags: [tagTypes.platformControl],
    }),

    getAllSubjects: builder.query({
      query: () => ({
        url: `/platform-control/get-subjects`,
        method: "GET",
      }),
      providesTags: [tagTypes.platformControl],
    }),

    getAllMedium: builder.query({
      query: () => ({
        url: `/platform-control/get-medium`,
        method: "GET",
      }),
      providesTags: [tagTypes.platformControl],
    }),

  }),
});

export const {
 useAddClassesMutation,
 useAddMediumsMutation,
 useAddSubjectsMutation,
 useGetAllClassesQuery,
 useGetAllMediumQuery,
 useGetAllSubjectsQuery
} = platformControlApi;
