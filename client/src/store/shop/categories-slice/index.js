import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/api";

// Public fetch - no withCredentials needed
export const fetchPublicCategories = createAsyncThunk(
    "shopCategories/fetchPublicCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/shop/categories/get");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch categories"
            );
        }
    }
);

const shopCategoriesSlice = createSlice({
    name: "shopCategories",
    initialState: {
        isLoading: false,
        categoryList: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPublicCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categoryList = action.payload.data || [];
            })
            .addCase(fetchPublicCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.categoryList = [];
                state.error = action.payload;
            });
    },
});

export default shopCategoriesSlice.reducer;
