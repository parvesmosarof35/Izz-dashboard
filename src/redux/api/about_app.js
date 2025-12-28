import { baseApi } from "../baseUrl";

// about api
export const aboutAppApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create about app
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
