import { baseApi } from "../baseUrl";

// gamification api
export const gamificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get gamification settings
    getGamification: builder.query({
      query: () => ({
        url: "/gamification/settings",
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["Gamification"],
    }),

    // upsert gamification settings
    updateGamification: builder.mutation({
      query: (data) => ({
        url: "/gamification/settings",
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Gamification"],
    }),

    // get all badges
    getAllBadges: builder.query({
      query: () => ({
        url: "/gamification/all-badges",
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["Gamification"],
    }),
    
  }),
});

export const { useGetGamificationQuery, useUpdateGamificationMutation, useGetAllBadgesQuery } =
  gamificationApi;
