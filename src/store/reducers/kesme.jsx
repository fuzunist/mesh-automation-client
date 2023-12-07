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
        console.log(tokens, "tokk");
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
          console.log(kesme, "kesmee api");
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
        body: { kesme_details:kesme },
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
// const selectResult= apiSlice.endpoints.getAllVerses.select();

// export const adapterSelectors = createSelector(
//     selectResult,
//     (result) => result.data
//   )

//   export const {
//     selectAll,
//     selectById

//     // Pass in a selector that returns the tasks slice of state
// } = versesAdapter.getSelectors((state) => adapterSelectors(state) ?? initialState)

// export const selectFiltered= createSelector(
//     selectResult,
//     ()
// )

// //  export const {selectEntities}= versesAdapter.getSelectors((state)=> adapterSelectors(state) ?? initialState)

// // //  const {selectEntities} = versesAdapter.getSelectors()
// // //  export const selectAllVerses= selectEntities;

// // export const selectSearchResult = createSelector(
// //     selectEntities,
// //   (res) => res.map((v)=>v) //normalized state object with ids & entities
// // );

// // const versesSelector = versesAdapter.getSelectors((state)=> adapterSelectors(state) ?? initialState)

// // And then use the selectors to retrieve values
// // export const allVerses = versesSelector.selectIds()

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   kesmeList: [],
// };

// const kesme = createSlice({
//   name: "kesme",
//   initialState,
//   reducers: {
//     _setKesmeList: (state, action) => {
//       const { data } = action.payload;
//       console.log(data, "data");
//       console.log(action.payload, "action.payload");
//       state.kesmeList = action.payload;
//     },
//   },
// });

// export const { _setKesmeList } = user.actions;
// export default kesme.reducer;
