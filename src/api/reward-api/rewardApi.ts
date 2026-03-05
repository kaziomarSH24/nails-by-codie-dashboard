import { baseApi } from "../base-api/baseApi"

export const rewardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        allReward: builder.query({
            query: () => ({
                url: `/admin/reward-settings`,
                method: "GET"
            })
        }),
        rewardClim: builder.mutation({
            query: (payload) => ({
                url: `/admin/reward-settings`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Reward"]
        })



    }),
})

export const { useAllRewardQuery, useRewardClimMutation } = rewardApi;
