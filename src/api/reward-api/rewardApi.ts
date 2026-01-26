import { baseApi } from "../base-api/baseApi"

export const rewardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        allReward: builder.query({
            query: () => ({
                url: `/admin/reward-settings`,
                method: "GET"
            })
        })



    }),
})

export const { useAllRewardQuery } = rewardApi;
