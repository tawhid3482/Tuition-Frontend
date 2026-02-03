import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/src/helpers/axios/axiosBaseQuery";
import { tagTypesList } from "../tag-types";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_API as string,
  }),
  endpoints: () => ({}),
  tagTypes:tagTypesList
});
