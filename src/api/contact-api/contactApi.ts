import { baseApi } from "../base-api/baseApi"

export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        allContactInfo: builder.query({
            query: () => ({
                url: `/admin/settings/contact-info`,
                method: "GET"
            }),
            providesTags: ["Contact"]
        }),
        contactUpload: builder.mutation({
            query: (formData) => ({
                url: `/admin/settings/contact-info`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Contact"]
        }),
        contactDelete: builder.mutation({
            query: (id) => ({
                url: `/admin/settings/contact-info?platform=${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Contact"],
        }),
        // contactUpdate : builder.mutation({
        //     query
        // })


    }),
})

export const { useAllContactInfoQuery, useContactUploadMutation, useContactDeleteMutation } = stockApi
