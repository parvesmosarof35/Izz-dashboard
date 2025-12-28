import { baseApi } from "../baseUrl";

// category api
export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get all sports type categories
    getAllSportsTypeCategories: builder.query({
      query: () => ({
        url: "/sports-types",
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["Category"],
    }),

    // create sports type category
    createSportsTypeCategory: builder.mutation({
      query: (credentials) => ({
        url: "/sports-types",
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
        body: credentials,
      }),
    }),
  }),
});

export const {
  useCreateSportsTypeCategoryMutation,
  useGetAllSportsTypeCategoriesQuery,
} = categoryApi;
