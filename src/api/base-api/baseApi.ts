import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://10.10.10.55:90/api/v1",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            headers.set("Accept", "application/json");

            return headers;
        },
    }),
    tagTypes: [
        "Auth",
        "Course",
        "Lesson"
    ],
    endpoints: () => ({}),
});
