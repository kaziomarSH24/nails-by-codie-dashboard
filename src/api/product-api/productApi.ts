import { baseApi } from "../base-api/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allProduct: builder.query({
      query: ({ page, per_page, search }) => ({
        url: `/admin/products?sort=-created_at&per_page=${per_page}&current_page=${page}&sort=-created_at&filter[title]=${search}`,
        method: "GET",
      }),
    }),
    synceProduct: builder.mutation({
      query: () => ({
        url: "/admin/products/sync",
        method: "POST",
      }),
    }),
  }),
});

export const { useAllProductQuery, useSynceProductMutation } = productApi;
