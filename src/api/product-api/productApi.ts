import { baseApi } from "../base-api/baseApi"

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        allProduct: builder.query({
            query: () => ({
                url: `/admin/products`,
                method: "GET"
            })
        }),
        synceProduct: builder.mutation({
            query: () => ({
                url: "/admin/products/sync",
                method: "POST"
            })
        })



    }),
})

export const { useAllProductQuery, useSynceProductMutation } = productApi
