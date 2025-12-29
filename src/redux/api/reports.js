import { baseApi } from "../baseUrl";

// reports api
export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get all reports
    getAllReports: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/supports?page=${page}&limit=${limit}`,
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export const { useGetAllReportsQuery } = reportsApi;
