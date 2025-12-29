import { baseApi } from "../baseUrl";

// user management api
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
    // get users with pagination
    getAllUsersPaginated: builder.query({
      query: ({ page = 1, limit = 10, role, status }) => {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (role && role !== "INACTIVE") {
          queryParams.append("role", role);
        }
        if (status === "INACTIVE") {
          queryParams.append("status", "INACTIVE");
        }

        return {
          url: `/users?${queryParams.toString()}`,
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        };
      },
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

export const {
  useGetAllUsersQuery,
  useGetAllUsersPaginatedQuery,
  useGetSingleUserQuery,
  useBlockUserMutation,
} = userManagementApi;
