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

    // toggle badge status (active/inactive)
    toggleBadgeStatus: builder.mutation({
      query: ({ badgeId, isActive }) => {
        return {
          url: `/gamification/badges/${badgeId}/active`,
          method: "PATCH",
          body: { isActive },
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        };
      },
      invalidatesTags: ["Gamification"],
    }),

    // delete badge
    deleteBadge: builder.mutation({
      query: (badgeId) => {
        return {
          url: `/gamification/badges/${badgeId}`,
          method: "PATCH",
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        };
      },
      invalidatesTags: ["Gamification"],
    }),
  }),
});

export const {
  useGetGamificationQuery,
  useUpdateGamificationMutation,
  useGetAllBadgesQuery,
  useToggleBadgeStatusMutation,
  useDeleteBadgeMutation,
} = gamificationApi;
