import { baseApi } from "../base-api/baseApi"

export const homeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        homeApi: builder.query({
            query: () => ({
                url: `/admin/dashboard`,
                method: "GET"
            })
        }),
        incomeChart: builder.query({
            query: (filter) => ({
                url: `/admin/chart/income?filter=${filter}`,
                method: "GET"
            })
        }),
        userChart: builder.query({
            query: (filter) => ({
                url: `/admin/chart/users?filter=${filter}`,
                method: "GET"
            })
        })




    }),
})

export const { useHomeApiQuery, useIncomeChartQuery, useUserChartQuery } = homeApi
