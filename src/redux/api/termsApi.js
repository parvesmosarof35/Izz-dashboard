import { baseApi } from "../baseUrl";

// terms api
export const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get terms and condition
    // getTermsAndCondition: builder.query({
    //   query: () => ({
    //     url: "/terms-conditions",
    //     method: "GET",
    //     headers: {
    //       Authorization: `${localStorage.getItem("accessToken")}`,
    //     },
    //   }),
    // }),

    // create terms and condition
    createTermsAndCondition: builder.mutation({
      query: (credentials) => ({
        url: "/terms-conditions",
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
        body: credentials,
      }),
    }),
  }),
});

export const { useGetTermsAndConditionQuery, useCreateTermsAndConditionMutation } = termsApi;
