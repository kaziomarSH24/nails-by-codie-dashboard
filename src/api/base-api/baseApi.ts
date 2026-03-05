import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const baseApi = createApi({

    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1`,
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
        "Lesson",
        "Stock",
        "Term",
        "Contact",
        "FAQ",
        "Reward",
        "Notification"
    ],
    endpoints: () => ({}),
});
