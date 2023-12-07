import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useCookies } from "react-cookie";

const kesme = createApi({
  reducerPath: "kesme",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    // credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const tokens = getState().user.tokens;
      if (tokens) {
        headers.set("Authorization", `Bearer ${tokens.access_token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllKesme: builder.query({
      query: () => "/kesme",
      keepUnusedDataFor: 300,
      transformResponse: (res) => {
        let transformedArray = [];
        res.forEach((kesme) => {
          return transformedArray.push(kesme);
        });

        return transformedArray;
      },
      providesTags: ["Kesme"],
    }),
    addKesme: builder.mutation({
      query: (kesme) => ({
        url: `/kesme`,
        method: "POST",
        body: { kesme_details: kesme },
      }),
      invalidatesTags: ["Kesme"],
    }),

    deleteKesme: builder.mutation({
      query: (kesme_id) => ({
        url: `/kesme/${kesme_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Kesme"],
    }),

    deleteAllKesme: builder.mutation({
      query: () => ({
        url: `/kesme/delete/all`,
        method: "DELETE",
      }),
      invalidatesTags: ["Kesme"],
    }),
  }),
});
export const {
  useGetAllKesmeQuery,
  useAddKesmeMutation,
  useDeleteKesmeMutation,
  useDeleteAllKesmeMutation,
} = kesme;
export default kesme;
