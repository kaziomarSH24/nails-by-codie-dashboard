import { baseApi } from "../base-api/baseApi"

export const incomeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        incomeReport: builder.query({
            query: () => ({
                url: `/admin/income-report`,
                method: "GET"
            })
        }),

        incomeDetails: builder.query({
            query: (viewId) => ({
                url: `/admin/income-report/${viewId}`,
                method: "GET"
            })
        })




    }),
})

export const { useIncomeReportQuery, useIncomeDetailsQuery } = incomeApi
