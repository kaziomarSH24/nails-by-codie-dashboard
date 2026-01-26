import { baseApi } from "../base-api/baseApi"

export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        stockOverview: builder.query({
            query: () => ({
                url: `/admin/stocks/overview`,
            }),
            providesTags: ["Stock"]
        }),
        stockRequest: builder.query({
            query: () => ({
                url: `/admin/stocks/overview`,
                method: "GET"
            }),
            providesTags: ["Stock"]
        })



    }),
})

export const { useStockOverviewQuery, useStockRequestQuery } = stockApi
