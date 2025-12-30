import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sports-izz-122-backend.onrender.com/api/v1",
    // baseUrl: "https://acknowledge-veterinary-care-josh.trycloudflare.com/api/v1",
  }),
  tagTypes: ["User", "Category", "Admin", "Reports", "Gamification"],
  endpoints: () => ({}),
});
