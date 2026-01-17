import type { AdminLoginPayloadType, LoginApiResponsetype } from "../../lib/type/authType"
import { baseApi } from "../base-api/baseApi"

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginApiResponsetype, AdminLoginPayloadType>({
            query: (formData) => ({
                url: "/auth/login",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Auth"],
        }),

        adminLogout: builder.mutation({
            query: () => ({
                url: `/auth/logout`,
                method: "POST",

            })
        }),

        emailVerify: builder.mutation({
            query: (formData) => ({
                url: `/auth/forgot-password`,
                method: "POST",
                body: formData
            })
        }),

        resendOtp: builder.mutation({
            query: (formData) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: formData,
            }),
        }),


        otpVerify: builder.mutation({
            query: (formData) => ({
                url: `/auth/verify-password-otp`,
                method: "POST",
                body: formData
            })
        }),


        profile: builder.query({
            query: () => ({
                url: `/profile/me`,
                method: "GET"
            })
        }),

        profileUpdate: builder.mutation({
            query: (formData) => ({
                url: `/profile/update`,
                method: "POST",
                body: formData
            })
        }),

        passwordUpdate: builder.mutation({
            query: (formData) => ({
                url: `/auth/update-password`,
                method: "POST",
                body: formData
            })
        })




    }),
})

export const {
    useLoginMutation,
    useAdminLogoutMutation,
    useEmailVerifyMutation,
    useResendOtpMutation, useOtpVerifyMutation, useProfileQuery, useProfileUpdateMutation,usePasswordUpdateMutation
} = authApi
