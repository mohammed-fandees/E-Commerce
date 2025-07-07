import React, { createContext, useReducer, useEffect } from 'react';
import {
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  clearWishlist as apiClearWishlist
} from '@/services/wishlistApi';

// Wishlist Actions
const WISHLIST_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  LOAD_WISHLIST: 'LOAD_WISHLIST',
  MOVE_ALL_TO_CART: 'MOVE_ALL_TO_CART'
};

// Initial state
const initialState = {
  items: [],
  isLoaded: false // Track if data has been loaded from localStorage
};

// Wishlist reducer
function wishlistReducer(state, action) {
  switch (action.type) {
    case WISHLIST_ACTIONS.LOAD_WISHLIST:
      return {
        ...state,
        items: action.payload || [],
        isLoaded: true // Mark as loaded
      };

    case WISHLIST_ACTIONS.ADD_ITEM:
      // Check if item already exists
      {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          return state; // Item already in wishlist
        }

        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }

    case WISHLIST_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: []
      };

    case WISHLIST_ACTIONS.MOVE_ALL_TO_CART:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
}

// Create context
export const WishlistContext = createContext();


// Wishlist Provider Component
export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from Supabase on mount
  useEffect(() => {
    let mounted = true;
    fetchWishlist()
      .then((products) => {
        if (!mounted) return;
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: products });
      })
      .catch(() => {
        if (mounted) dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: [] });
      });
    return () => { mounted = false; };
  }, []);



  // Action creators
  const addToWishlist = async (product) => {
    await apiAddToWishlist(product.id);
    dispatch({ type: WISHLIST_ACTIONS.ADD_ITEM, payload: product });
  };

  const removeFromWishlist = async (productId) => {
    await apiRemoveFromWishlist(productId);
    dispatch({ type: WISHLIST_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const clearWishlist = async () => {
    await apiClearWishlist();
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
  };

  const moveAllToCart = async (addToCartFunction) => {
    // Add all wishlist items to cart
    state.items.forEach(item => {
      addToCartFunction({
        id: item.id,
        name: item.title,
        img: item.image,
        price: item.price,
        quantity: 1
      });
    });
    // Clear wishlist in Supabase
    await apiClearWishlist();
    dispatch({ type: WISHLIST_ACTIONS.MOVE_ALL_TO_CART });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  const value = {
    items: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveAllToCart,
    isInWishlist,
    getWishlistCount,
    isLoaded: state.isLoaded // Expose loading state if needed
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}