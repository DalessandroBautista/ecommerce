import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config';

// URL base de la API
const API_URL = config.API_URL;

// Guardar cartId en localStorage
const saveCartIdToStorage = (cartId) => {
  localStorage.setItem('cartId', cartId);
};

// Obtener cartId de localStorage
const getCartIdFromStorage = () => {
  return localStorage.getItem('cartId');
};

// Función para obtener el carrito del servidor
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      const cartId = getCartIdFromStorage();
      
      // Si el usuario está autenticado, intentamos obtener su carrito
      if (user && user.token) {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get(`${API_URL}/api/cart/user`, config);
        return data;
      } 
      // Si hay un cartId guardado, obtenemos ese carrito
      else if (cartId) {
        const { data } = await axios.get(`${API_URL}/api/cart/${cartId}`);
        return data;
      }
      
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Función para actualizar el carrito en el servidor
export const updateCartItems = createAsyncThunk(
  'cart/updateCartItems',
  async (items, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      const cartId = getCartIdFromStorage();
      
      const requestBody = {
        items,
        ...(cartId && { cartId }),
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        },
      };
      
      const { data } = await axios.post(`${API_URL}/api/cart`, requestBody, config);
      
      // Guardamos el cartId para futuros usos
      if (data.cartId) {
        saveCartIdToStorage(data.cartId);
      }
      
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

// Función para fusionar carritos al iniciar sesión
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      const cartId = getCartIdFromStorage();
      
      // Solo intentamos fusionar si hay un usuario autenticado y un carrito anónimo
      if (user?.token && cartId) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.post(
          `${API_URL}/api/cart/merge`,
          { cartId },
          config
        );
        
        // Eliminamos el cartId del localStorage porque ahora usaremos el del usuario
        localStorage.removeItem('cartId');
        
        return data;
      }
      
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Estado inicial del carrito
const initialState = {
  items: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existItem = state.items.find((x) => x.product === item.product);
      
      if (existItem) {
        state.items = state.items.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.items.push(item);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateCartItemsLocally: (state, action) => {
      // Esta acción se usa para actualizar el carrito localmente sin llamar a la API
      state.items = action.payload;
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload) {
          state.items = action.payload.items;
          state.cartId = action.payload.cartId;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Casos para updateCartItems
      .addCase(updateCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items = action.payload.items;
        state.cartId = action.payload.cartId;
      })
      .addCase(updateCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Casos para mergeCart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items;
          state.cartId = action.payload.cartId;
        }
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addItem, removeItem, updateCartItemsLocally, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
