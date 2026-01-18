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




    }),
})

export const {

    useUploadCourseMutation,
    useAllCourseQuery,
    useDeleteCourseMutation

} = courseApi
