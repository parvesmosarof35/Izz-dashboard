import { baseApi } from "../baseUrl";

// auth api
export const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create terms and condition
    createPolicy: builder.mutation({
      query: (credentials) => ({
        url: "/policy",
        method: "PATCH",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
        body: credentials,
      }),
    }),
  }),
});

export const { useCreatePolicyMutation } = policyApi;
