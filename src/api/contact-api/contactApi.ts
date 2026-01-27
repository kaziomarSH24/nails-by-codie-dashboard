import { baseApi } from "../base-api/baseApi"

export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        allContactInfo: builder.query({
            query: () => ({
                url: `/admin/settings/contact-info`,
                method: "GET"
            }),
            providesTags : ["Contact"]
        })



    }),
})

export const { useAllContactInfoQuery } = stockApi
