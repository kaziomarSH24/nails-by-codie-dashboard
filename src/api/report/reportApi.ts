import { baseApi } from "../base-api/baseApi"

export const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        reportGenerate: builder.query({
            query: ({ day, format }) => ({
                url: `/admin/income/generate-report?period=${day}&format=${format}`,
                method: "GET"
            })
        })



    }),
})

export const { useReportGenerateQuery } = reportApi;
