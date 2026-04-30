import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/api";

const initialState = {
  isLoading: false,
  categoryList: [],
};

export const addCategory = createAsyncThunk(
  "/categories/addCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/admin/categories/add`,
        formData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const fetchAllCategories = createAsyncThunk(
  "/categories/fetchAllCategories",
  async () => {
    const response = await axios.get(`/admin/categories/get`, {
      withCredentials: true,
    });

    return response.data;
  },
);

export const uploadCategoryIcon = createAsyncThunk(
  "/categories/uploadCategoryIcon",
  async ({ id, formData }) => {
    const response = await axios.post(
      `/admin/categories/upload-icon/${id}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },
);

export const deleteCategory = createAsyncThunk(
  "/categories/deleteCategory",
  async (id) => {
    const response = await axios.delete(
      `/admin/categories/delete/${id}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  },
);

export const editCategory = createAsyncThunk(
  "/categories/editCategory",
  async ({ id, formData }) => {
    const response = await axios.put(
      `/admin/categories/edit/${id}`,
      formData,
      {
        withCredentials: true,
      },
    );

    return response.data;
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    ...initialState,
    isFullyLoaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFullyLoaded = true;
        state.categoryList = action.payload.data;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.isLoading = false;
        state.isFullyLoaded = true;
        state.categoryList = [];
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload.data);
      });
  },
});

export default categoriesSlice.reducer;
