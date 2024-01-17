import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rowData: null, // Add state to store row data
    // Other states can be added as required
};

const editSlice = createSlice({
    name: "edit",
    initialState,
    reducers: {
        setRowData: (state, action) => {
            state.rowData = action.payload; // Sets the current row data
        },
        // Add other reducers as required
    },
});

// Export the action
export const { setRowData } = editSlice.actions;

// Export the reducer
export default editSlice.reducer;
