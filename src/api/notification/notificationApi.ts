import { baseApi } from "../base-api/baseApi"

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allNotification: builder.query({
            query: ({ per_page, page }) => ({
                url: `/notifications?per_page=${per_page}&page=${page}`
            }),
            providesTags: ["Notification"]
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Notification"]
        }),
        readAllNotification: builder.mutation({
            query: () => ({
                url: `/notifications/mark-all-as-read`,
                method: "POST"
            }),
            invalidatesTags: ["Notification"]
        }),
        unReadNotification: builder.query({
            query: () => ({
                url: `/notifications/stats`,
                method: "GET"
            }),
            providesTags: ["Notification"]
        }),
        readSingleNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/mark-as-read`,
                method: "POST"
            })
        })
    }),
})

export const { useAllNotificationQuery, useDeleteNotificationMutation, useReadAllNotificationMutation, useUnReadNotificationQuery, useReadSingleNotificationMutation } = notificationApi
