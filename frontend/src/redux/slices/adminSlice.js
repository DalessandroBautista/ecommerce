import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config';

// URL base de la API
const API_URL = config.API_URL;

// Estado inicial
const initialState = {
  users: [],
  loading: false,
  error: null,
  success: false,
};

// Obtener lista de usuarios
export const listUsers = createAsyncThunk(
  'admin/listUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/users`, config);
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

// Eliminar usuario
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`${API_URL}/api/users/${id}`, config);
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

// Actualizar usuario admin/no-admin
export const updateUserAdmin = createAsyncThunk(
  'admin/updateUserAdmin',
  async ({ id, isAdmin }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/users/${id}`, 
        { isAdmin }, 
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

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lista de usuarios
      .addCase(listUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Eliminar usuario
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Actualizar usuario admin
      .addCase(updateUserAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.map(user => 
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUserAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;