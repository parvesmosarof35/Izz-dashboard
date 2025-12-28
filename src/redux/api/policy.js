import { baseApi } from "../baseUrl";

// policy api
export const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create privacy policy
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
