import { baseApi } from "../base-api/baseApi"

export const lessonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        lessonUpload: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/admin/courses/${id}/lessons`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Lesson"],
        }),

        getLessonByCourseId: builder.query({
            query: (courseId) => ({
                url: `/admin/courses/${courseId}`,
                method: "GET",
            }),
            providesTags: ["Lesson"]
        }),

        lessonDelete: builder.mutation({
            query: ({ courseId, lessonId }) => ({
                url: `/admin/courses/${courseId}/lessons/${lessonId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Lesson"]
        })




    }),
})

export const { useLessonUploadMutation, useGetLessonByCourseIdQuery, useLessonDeleteMutation } = lessonApi
