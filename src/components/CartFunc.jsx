// contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();


const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  }
  return { items: [] };
};

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }
      break;
    
    case 'DECREASE_ITEM':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0)
      };
      break;
    
    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
      break;
    
    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
      break;
    
    case 'CLEAR_CART':
      newState = {
        ...state,
        items: []
      };
      break;
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
  
  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const decreaseItem = (productId) => {
    dispatch({ type: 'DECREASE_ITEM', payload: productId });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const getCartDeliveryTotal = () => {
    if (state.items.length === 0) return 0;
    
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    
    // First item delivery is always charged
    let deliveryCharges = 1;
    
    // Additional charges for every 5 items after the first
    if (totalItems > 1) {
      const additionalItems = totalItems - 1;
      deliveryCharges += Math.floor(additionalItems / 5);
    }
    
    // If items have different delivery fees, use the highest one
    const maxDeliveryFee = Math.max(...state.items.map(item => item.delivery_fee || 0));
    
    return maxDeliveryFee * deliveryCharges;
  };
  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const isItemInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items: state.items,
    addToCart,
    decreaseItem,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isItemInCart,
    getItemQuantity,
    getCartDeliveryTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};