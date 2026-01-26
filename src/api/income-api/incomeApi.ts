import { baseApi } from "../base-api/baseApi"

export const incomeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        incomeReport: builder.query({
            query: () => ({
                url: `/admin/income-report`,
                method: "GET"
            })
        })




    }),
})

export const { useIncomeReportQuery } = incomeApi
