import { baseApi } from "../baseUrl";

// auth api
export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get users
    getAllUsers: builder.query({
      query: (params = "") => ({
        url: `/users${params}`,
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["User"],
    }),

    // get single user
    getSingleUser: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
    }),

    // user block
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/users/update-user-status-inactive/${userId}`,
        method: "PATCH",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
  }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery, useBlockUserMutation } = userManagementApi;
