import { baseApi } from "../base-api/baseApi"

export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        createTermCondiction: builder.mutation({
            query: (payload) => ({
                url: `/admin/settings/terms`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Term"]
        }),

        getTermValue: builder.query({
            query: () => ({
                url: `/admin/settings/terms`,
                method: "GET"
            }),
            providesTags: ["Term"]
        })


    }),
})

export const { useCreateTermCondictionMutation, useGetTermValueQuery } = stockApi
