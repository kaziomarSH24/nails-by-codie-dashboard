import { baseApi } from "../base-api/baseApi"

export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        createFaq: builder.mutation({
            query: (payload) => ({
                url: `/admin/settings/faqs`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["FAQ"]
        }),
        allFaq: builder.query({
            query: () => ({
                url: `/admin/settings/faqs`,
                method: "GET"
            }),
            providesTags: ["FAQ"]
        }),

        faqDelete: builder.mutation({
            query: (id) => ({
                url: `/admin/settings/faqs/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["FAQ"]
        }),
        faqUpdate: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/admin/settings/faqs/${id}`,
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["FAQ"]
        })



    }),
})

export const { useCreateFaqMutation, useAllFaqQuery, useFaqDeleteMutation, useFaqUpdateMutation } = faqApi;
