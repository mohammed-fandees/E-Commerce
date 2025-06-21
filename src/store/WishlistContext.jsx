import React, { createContext, useReducer, useEffect, useRef } from 'react';

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
      { const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      }; }

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
  const isInitialMount = useRef(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: parsedWishlist });
      } else {
        // If no saved wishlist, mark as loaded with empty array
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: [] });
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      // Even if there's an error, mark as loaded to prevent infinite loops
      dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: [] });
    }
  }, []);

  // Save to localStorage whenever wishlist changes (but only after initial load)
  useEffect(() => {
    // Skip saving on initial mount and before data is loaded
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only save if data has been loaded from localStorage
    if (!state.isLoaded) {
      return;
    }

    try {
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [state.items, state.isLoaded]);

  // Action creators
  const addToWishlist = (product) => {
    dispatch({ type: WISHLIST_ACTIONS.ADD_ITEM, payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
  };

  const moveAllToCart = (addToCartFunction) => {
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
    
    // Clear wishlist
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