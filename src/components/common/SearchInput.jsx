import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CATEGORY_LABELS } from "@/data/categoryLabels";
import { useNavigate } from "react-router-dom";
import SearchResultRow from "./SearchResultRow";
import { fetchProducts } from "@/services/apis";

const SearchInput = ({ className = "", inputClassName = "", isRTL = false, ...props }) => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Cache for products
  const productsCache = useRef({});

  const getTrendingProducts = (products) => {
    return [...products]
      .filter(p => typeof p === 'object' && p.rating && (p.reviews_count || p.reviewsCount))
      .sort((a, b) => ((b.rating * (b.reviews_count || b.reviewsCount)) - (a.rating * (a.reviews_count || a.reviewsCount))))
      .slice(0, 4);
  };

  // Fetch and cache products
  const fetchAndCacheProducts = async (searchQuery = '') => {
    if (productsCache.current[searchQuery]) {
      setProducts(productsCache.current[searchQuery]);
      return;
    }
    try {
      const response = await fetchProducts(searchQuery);
      if (response) {
        productsCache.current[searchQuery] = response;
        setProducts(response);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    // Initial fetch (all products)
    fetchAndCacheProducts('');
  }, []);

  // Map category key to localized label
  const getCategoryLabel = (catKey) => {
    try {
      return t(CATEGORY_LABELS[catKey] || catKey);
    } catch (error) {
      console.warn("Translation error for category:", catKey, error);
      return catKey;
    }
  };


  // --- Search History (localStorage) ---
  const SEARCH_HISTORY_KEY = 'searchHistoryV2';
  const [searchHistory, setSearchHistory] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (raw) setSearchHistory(JSON.parse(raw));
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  }, []);

  const addToSearchHistory = (product) => {
    if (!product) return;
    setSearchHistory(prev => {
      const exists = prev.find(p => p.id === product.id);
      const updated = exists
        ? [product, ...prev.filter(p => p.id !== product.id)]
        : [product, ...prev];
      const limited = updated.slice(0, 8);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limited));
      return limited;
    });
  };

  // Generate search suggestions based on product titles and categories
  const generateSuggestions = (searchQuery) => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const suggestions = new Set();

    products.forEach(product => {
      const title = (product.title || '').toLowerCase();
      const category = getCategoryLabel(product.category || '').toLowerCase();

      // Add partial matches from titles
      const titleWords = title.split(' ');
      titleWords.forEach(word => {
        if (word.includes(query) && word !== query && word.length > 2) {
          suggestions.add(word);
        }
      });

      // Add category suggestions
      if (category.includes(query) && category !== query) {
        suggestions.add(category);
      }
    });

    return Array.from(suggestions).slice(0, 4);
  };


  // Enhanced search: word-sensitive and category-matching (first 5 results)
  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    if (!productsCache.current[searchQuery]) {
      fetchAndCacheProducts(searchQuery);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);
    const cachedProducts = productsCache.current[searchQuery] || products;

    // 1. Match if any word in query is found in product title (word boundary sensitive)
    let matchedProducts = cachedProducts.filter(product => {
      if (!product || typeof product !== 'object') return false;
      const title = (product.title || '').toLowerCase();
      return words.some(word => title.split(/\W+/).includes(word));
    });

    // 2. If less than 5, match if any word in query is found in category label (word boundary sensitive)
    if (matchedProducts.length < 5) {
      const needed = 5 - matchedProducts.length;
      const extra = cachedProducts.filter(product => {
        if (!product || typeof product !== 'object') return false;
        const categoryLabel = getCategoryLabel(product.category || '').toLowerCase();
        return words.some(word => categoryLabel.split(/\W+/).includes(word));
      }).filter(p => !matchedProducts.includes(p)).slice(0, needed);
      matchedProducts = matchedProducts.concat(extra);
    }

    // 3. If still less than 5, match if any word in query is found anywhere in title or category (substring, fallback)
    if (matchedProducts.length < 5) {
      const needed = 5 - matchedProducts.length;
      const extra = cachedProducts.filter(product => {
        if (!product || typeof product !== 'object') return false;
        const title = (product.title || '').toLowerCase();
        const categoryLabel = getCategoryLabel(product.category || '').toLowerCase();
        return words.some(word => title.includes(word) || categoryLabel.includes(word));
      }).filter(p => !matchedProducts.includes(p)).slice(0, needed);
      matchedProducts = matchedProducts.concat(extra);
    }

    matchedProducts = matchedProducts.slice(0, 5);

    // Generate suggestions
    const suggestionResults = generateSuggestions(searchQuery);

    setResults(matchedProducts);
    setSuggestions(suggestionResults);
  };

  useEffect(() => {
    performSearch(query);
  }, [query, i18n.language]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);
    setShowHistory(false);
    setSelectedIndex(-1);

    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      setShowDropdown(true);
    } else {
      setShowHistory(true);
      setShowDropdown(true);
    }
  };

  const handleSearch = (searchTerm = query) => {
    if (searchTerm.trim()) {
      setQuery(searchTerm);
      setShowDropdown(false);
      setShowHistory(false);
      // You can add navigation to search results page here
      console.log('Searching for:', searchTerm);
    }
  };

  const handleProductClick = (productId) => {
    setShowDropdown(false);
    setQuery("");
    const product = products.find(p => p.id === productId);
    if (product) addToSearchHistory(product);
    try {
      navigate(`/products/${productId}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    const totalItems = suggestions.length + results.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex === -1) {
          handleSearch();
        } else if (selectedIndex < suggestions.length) {
          handleSearch(suggestions[selectedIndex]);
        } else {
          handleProductClick(results[selectedIndex - suggestions.length].id);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className={`relative flex items-center rounded-md bg-[#F5F5F5] ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={t("header.searchPlaceholder") || "Search products..."}
            className={`w-full px-4 py-2 pr-12  focus:outline-none ${inputClassName}`}
            autoComplete="off"
            {...props}
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className=" absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => handleSearch()}
          className="px-4 py-2 text-gray-800  active:scale-95 rounded-r-md transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-white border border-[#db444440] scrollbar-none overflow-auto rounded-b-md shadow-2xl z-50 max-h-96 overflow-y-auto">
          {showHistory && !query.trim() && (
            <div>
              {/* Search History */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-gray-700">
                  {t("search.recentSearches") || "Recent Searches"}
                </h3>
              </div>
              {searchHistory.length === 0 && (
                <div className="px-4 py-2 text-gray-400 text-sm">{t("search.noHistory") || "No recent searches yet."}</div>
              )}
              {searchHistory.map((product, index) => (
                <SearchResultRow
                  key={`history-${product.id}`}
                  product={product}
                  categoryLabel={getCategoryLabel(product.category)}
                  onClick={() => handleProductClick(product.id)}
                  isLast={index === searchHistory.length - 1}
                />
              ))}
              {/* Trending */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 border-t">
                <h3 className="font-semibold text-sm text-gray-700">
                  {t("search.trending") || "Trending"}
                </h3>
              </div>
              {getTrendingProducts(products).map((product, index) => (
                <SearchResultRow
                  key={`trending-${product.id}`}
                  product={product}
                  categoryLabel={getCategoryLabel(product.category)}
                  onClick={() => handleProductClick(product.id)}
                  isLast={index === getTrendingProducts(products).length - 1}
                />
              ))}
            </div>
          )}

          {query.trim() && (
            <div>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`suggestion-${index}`}
                      className={`px-4 py-2  text-sm ${selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      onClick={() => handleSearch(suggestion)}
                    >
                      <Search className="w-4 h-4 text-gray-400 inline mr-3" />
                      <span className="font-semibold">{query}</span>
                      <span className="text-gray-600"> in {suggestion}</span>
                    </div>
                  ))}
                  {results.length > 0 && <div className="border-t border-gray-100"></div>}
                </div>
              )}

              {/* Product Results */}
              {results.length > 0 && (
                <div>
                  {results.map((product, index) => (
                    <div
                      key={product.id}
                      className={selectedIndex === suggestions.length + index ? 'bg-gray-100' : ''}
                    >
                      <SearchResultRow
                        product={product}
                        categoryLabel={getCategoryLabel(product.category)}
                        searchQuery={query}
                        onClick={() => handleProductClick(product.id)}
                        isLast={index === results.length - 1}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query.trim() && suggestions.length === 0 && results.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>{t("search.noResults") || `No results found for "${query}"`}</p>
                  <p className="text-sm mt-1">
                    {t("search.tryDifferent") || "Try different keywords or check your spelling"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;