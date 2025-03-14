import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Estado inicial
const initialState = {
  products: [],
  featuredProducts: [],
  product: null,
  loading: false,
  error: null,
  success: false,
  page: 0,
  pages: 0,
};

// Obtener listado de productos
export const listProducts = createAsyncThunk(
  'product/listProducts',
  async ({ keyword = '', pageNumber = '' }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );
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

// Obtener listado de productos destacados
export const listFeaturedProducts = createAsyncThunk(
  'product/listFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/featured`);
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

// Obtener detalles de un producto
export const listProductDetails = createAsyncThunk(
  'product/listProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
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

// Eliminar un producto
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/products/${id}`, config);
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

// Crear un producto
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/products`, {}, config);
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

// Actualizar un producto
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (product, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/products/${product._id}`,
        product,
        config
      );
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

// Subir imagen de producto
export const uploadProductImage = createAsyncThunk(
  'product/uploadImage',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
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

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    fetchProducts: (_state, _action) => {
      // Esta acción se usa para simular la carga de productos
      // No hace nada real por ahora, solo se incluye para compatibilidad
    },
    clearProductError: (state) => {
      state.error = null;
    },
    resetProductDetails: (state) => {
      state.product = null;
    },
    resetProductUpdate: (state) => {
      state.success = false;
    },
    resetProductCreate: (state) => {
      state.success = false;
      state.product = null;
    },
    resetProductReview: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Actualizar producto
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const {
  fetchProducts,
  clearProductError,
  resetProductDetails,
  resetProductUpdate,
  resetProductCreate,
  resetProductReview,
} = productSlice.actions;

export default productSlice.reducer;
