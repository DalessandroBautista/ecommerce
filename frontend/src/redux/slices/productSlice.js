/* eslint-disable no-unused-vars */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

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
      console.log('Solicitando lista de productos (admin)...');
      const { data } = await api.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      console.log('Productos recibidos en admin:', data.products?.length);
      return data;
    } catch (error) {
      console.error('Error al obtener productos (admin):', error);
      // Si hay problemas con el token, intentar con solicitud sin autenticación
      try {
        const { data } = await api.get(
          `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
        );
        console.log('Productos recibidos sin auth:', data.products?.length);
        return data;
      } catch (secondError) {
        console.error('Error definitivo al obtener productos:', secondError);
        return rejectWithValue(
          secondError.response && secondError.response.data.message
            ? secondError.response.data.message
            : secondError.message
        );
      }
    }
  }
);

// Obtener listado de productos destacados
export const listFeaturedProducts = createAsyncThunk(
  'product/listFeaturedProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('Solicitando productos destacados...');
      const { data } = await api.get('/api/products/featured');
      console.log('Productos destacados recibidos:', data.length);
      return data;
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      
      // Solución temporal: usar los productos normales del estado
      const { products } = getState().product;
      
      if (products && products.length > 0) {
        console.log('Usando productos normales como fallback:', products.length);
        // Tomar los primeros 6 o menos
        return products.slice(0, 6);
      }
      
      // Si no hay productos retornar array vacío
      return [];
    }
  }
);

// Obtener detalles de un producto
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
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

      await api.delete(`/api/products/${id}`, config);
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
  async (productData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await api.post('/api/products', productData, config);
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
  async ({ id, productData }, { getState, rejectWithValue }) => {
    try {
      // Obtener el token
      const { user } = getState().user;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      console.log('Actualizando producto con ID:', id);
      console.log('Datos a enviar:', productData);
      console.log('Headers de autenticación:', config.headers);

      const { data } = await api.put(`/api/products/${id}`, productData, config);
      return data;
    } catch (error) {
      console.error('Error al actualizar producto:', error.response || error);
      
      // Mensaje de error más descriptivo
      const errorMsg = 
        error.response && error.response.data.message
          ? `${error.response.data.message} (${error.response.status})`
          : error.message;
          
      return rejectWithValue(errorMsg);
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

      const { data } = await api.post('/api/upload', formData, config);
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
      // Listar productos
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        console.log('Datos recibidos en Redux:', action.payload);
        state.loading = false;
        state.products = action.payload.products || [];
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Listar productos destacados
      .addCase(listFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(listFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(listFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        // No establecer error cuando usamos el fallback
        // state.error = action.payload;
      })
      
      // Obtener detalles de producto
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Eliminar producto
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Crear producto
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
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
      
      // Subir imagen de producto
      .addCase(uploadProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProductError,
  resetProductDetails,
  resetProductUpdate,
  resetProductCreate,
  resetProductReview,
} = productSlice.actions;

export default productSlice.reducer;
