import { baseApi } from "../base-api/baseApi"

export const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        postSupportMessage: builder.mutation({
            query: (payload) => ({
                url: `/support/submit`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Support"]
        }),

        


    }),
})

export const { usePostSupportMessageMutation } = supportApi
