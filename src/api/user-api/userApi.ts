import { baseApi } from "../base-api/baseApi"

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        allUsers: builder.query({
            query: () => ({
                url: `/admin/users`,
            }),
            providesTags: ["Stock", "Auth"]
        }),


        userDetails: builder.query({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: "GET"
            }),
            providesTags: ["Auth"]
        }),
        userBand: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}/toggle-suspend`,
                method: "PUT"
            }),
            invalidatesTags: ["Auth"]
        })




    }),
})

export const { useAllUsersQuery, useUserDetailsQuery, useUserBandMutation } = userApi
