import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/helpers/axios/axiosBaseQuery";
import { tagTypesList } from "../tag-types";
import { API_BASE_URL } from "@/src/config/site";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
