import { baseApi } from "../baseUrl";

// auth api
export const aboutAppApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create terms and condition
    aboutAppPolicy: builder.mutation({
      query: (credentials) => ({
        url: "/settings/about",
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
        body: credentials,
      }),
    }),
  }),
});

export const { useAboutAppPolicyMutation } = aboutAppApi;
