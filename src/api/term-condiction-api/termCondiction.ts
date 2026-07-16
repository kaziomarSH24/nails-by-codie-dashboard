import { baseApi } from "../base-api/baseApi";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTermCondiction: builder.mutation({
      query: (payload) => ({
        url: `/admin/settings/terms`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Term"],
    }),

    getTermValue: builder.query({
      query: () => ({
        url: `/admin/settings/terms`,
        method: "GET",
      }),
      providesTags: ["Term"],
    }),
    createPrivacyPolicy: builder.mutation({
      query: (payload) => ({
        url: `/admin/settings/privacy-policy`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Privacy"],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: `/admin/settings/privacy-policy`,
        method: "GET",
      }),
      providesTags: ["Privacy"],
    }),
  }),
});

export const {
  useCreateTermCondictionMutation,
  useGetTermValueQuery,
  useCreatePrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,
} = stockApi;
