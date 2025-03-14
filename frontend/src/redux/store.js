import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';

// Reducer temporal simplificado para diagnóstico
const cartReducer = (state = { items: [] }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    category: categoryReducer,
    order: orderReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export default store;
