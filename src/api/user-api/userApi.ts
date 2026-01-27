import { baseApi } from "../base-api/baseApi"

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({


        allUsers: builder.query({
            query: () => ({
                url: `/admin/users`,
            }),
            providesTags: ["Stock"]
        }),


        userDetails: builder.query({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: "GET"
            })
        })




    }),
})

export const { useAllUsersQuery, useUserDetailsQuery } = userApi
