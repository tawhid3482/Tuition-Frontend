import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tag-types";
import { axiosBaseQuery } from "@/src/helpers/axios/axiosBaseQuery";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    // baseUrl: "https://news-server-nine-pied.vercel.app/api/s1",
    baseUrl: "http://localhost:5000/api/s1",
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
