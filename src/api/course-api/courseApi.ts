import { baseApi } from "../base-api/baseApi"

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadCourse: builder.mutation({
            query: (formData) => ({
                url: `/admin/courses/`,
                method: "POST",
                body: formData
            }),

            invalidatesTags: ["Course"]

        }),

        allCourse: builder.query({
            query: () => ({
                url: `/admin/courses/?sort=-created_at`,
                method: "GET"
            }),
            providesTags: ["Course"]
        }),

        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/admin/courses/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Course"]
        }),

        publishCourse: builder.mutation({
            query: (courseId) => ({
                url: `/admin/courses/${courseId}/status?is_published=1`,
                method: "PUT"
            }),
            invalidatesTags: ["Course"]
        }),
        unPublishCourse: builder.mutation({
            query: (courseId) => ({
                url: `/admin/courses/${courseId}/status?is_published=0`,
                method: "PUT"
            }),
            invalidatesTags: ["Course"]
        }),
        courseUpdate: builder.mutation({
            query: ({ formData, id }) => ({
                url: `/admin/courses/${id}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Course"]
        })




    }),
})

export const {

    useUploadCourseMutation,
    useAllCourseQuery,
    useDeleteCourseMutation,
    usePublishCourseMutation,
    useUnPublishCourseMutation,
    useCourseUpdateMutation

} = courseApi
