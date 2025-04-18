import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload, loading: false };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.product === action.payload.product);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item => 
            item.product === action.payload.product 
              ? { ...item, quantity: item.quantity + action.payload.quantity } 
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.product !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.product === action.payload.product 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const initialState = {
    items: [],
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          };
          const res = await axios.get('/api/cart', config);
          dispatch({ type: 'SET_CART', payload: res.data });
        } else {
          // Load from localStorage if not logged in
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          dispatch({ type: 'SET_CART', payload: localCart });
        }
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.msg || 'Failed to load cart' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, state.loading]);

  // Cart operations
  const addToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      const item = { product, quantity };
      
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        await axios.post('/api/cart', item, config);
      }
      
      dispatch({ type: 'ADD_TO_CART', payload: item });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.msg || 'Failed to add item to cart' });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        await axios.delete(`/api/cart/${productId}`, config);
      }
      
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.msg || 'Failed to remove item from cart' });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        await axios.put(`/api/cart/${productId}`, { quantity }, config);
      }
      
      dispatch({ type: 'UPDATE_QUANTITY', payload: { product: productId, quantity } });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.msg || 'Failed to update quantity' });
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        await axios.delete('/api/cart', config);
      }
      
      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.msg || 'Failed to clear cart' });
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        loading: state.loading,
        error: state.error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);