import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Estado inicial
const initialState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
  success: false,
};

// Obtener lista de categorías
export const listCategories = createAsyncThunk(
  'category/listCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/categories');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Crear categoría
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await api.post('/api/categories', categoryData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Eliminar categoría
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await api.delete(`/api/categories/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Obtener detalles de categoría
export const getCategoryDetails = createAsyncThunk(
  'category/getCategoryDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/categories/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Actualizar categoría
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, categoryData }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await api.put(`/api/categories/${id}`, categoryData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryState: (state) => {
      state.error = null;
      state.success = false;
    },
    resetCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lista de categorías
      .addCase(listCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Crear categoría
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Eliminar categoría
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Obtener detalles de categoría
      .addCase(getCategoryDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(getCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Actualizar categoría
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
        state.category = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryState, resetCategory } = categorySlice.actions;
export default categorySlice.reducer;