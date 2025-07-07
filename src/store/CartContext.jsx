import React, { createContext, useReducer, useEffect } from 'react';
import {
  fetchCartItems,
  addOrUpdateCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCartItems
} from '@/services/cartApi';

const CartContext = createContext();

const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_COUPON: 'APPLY_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON'
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
    }


    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        coupon: null // clear coupon in state too
      };

    case CART_ACTIONS.APPLY_COUPON:
      return {
        ...state,
        coupon: action.payload
      };

    case CART_ACTIONS.REMOVE_COUPON:
      return {
        ...state,
        coupon: null
      };

    default:
      return state;
  }
};

// Load coupon from localStorage if exists
const initialState = {
  items: [],
  coupon: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart_coupon')) || null : null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [loading, setLoading] = React.useState(true);

  // Load cart items on mount
  useEffect(() => {
    setLoading(true);
    fetchCartItems()
      .then((items) => {
        items.forEach(item => {
          dispatch({
            type: CART_ACTIONS.ADD_ITEM, payload: {
              ...item,
              id: item.product_id,
              image: item.img || item.image,
              title: item.name
            }
          });
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Cart actions
  const addItem = async (product) => {
    await addOrUpdateCartItem(product, product.quantity || 1);
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  };

  const removeItem = async (id) => {
    await removeCartItem(id);
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
  };

  const updateQuantity = async (id, quantity) => {
    await updateCartItemQuantity(id, quantity);
    if (quantity <= 0) {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
    } else {
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
    }
  };

  const clearCart = async () => {
    await clearCartItems();
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    localStorage.removeItem('cart_coupon'); // remove coupon when clearing cart
  };

  const applyCoupon = (coupon) => {
    dispatch({ type: CART_ACTIONS.APPLY_COUPON, payload: coupon });
    localStorage.setItem('cart_coupon', JSON.stringify(coupon)); // save to localStorage
  };

  const removeCoupon = () => {
    dispatch({ type: CART_ACTIONS.REMOVE_COUPON });
    localStorage.removeItem('cart_coupon'); // remove from localStorage
  };

  // Computed values
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = state.coupon ? (subtotal * state.coupon.percentage) / 100 : 0;
  const shipping = subtotal > 140 ? 0 : 25;
  const total = subtotal - discount + shipping;

  const value = {
    ...state,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
