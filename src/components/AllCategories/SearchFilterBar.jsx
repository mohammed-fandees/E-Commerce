import React from "react";
import { Search, List, Star, ChevronDown, Grid } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SearchFilterBar = ({ t, searchTerm, setSearchTerm, sortBy, setSortBy, viewMode, setViewMode }) => {
  const sortOptions = [
    { value: 'name', label: t("categories.sort.name") },
    { value: 'popular', label: t("categories.sort.popular") },
    { value: 'newest', label: t("categories.sort.newest") },
    { value: 'count', label: t("categories.sort.item_count") },
  ];

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex  gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("categories.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#db4444] focus:border-transparent transition-all duration-200"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2  outline-none transition-all duration-200 relative min-w-[100px]"
                  aria-label={t("categories.sort.label")}
                  type="button"
                >
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                  <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => setSortBy(option.value)}
                    className={sortBy === option.value && "bg-[#db4444] text-white"}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <DropdownMenuShortcut>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-white text-[#db4444] shadow-sm'
                  : 'text-gray-600 hover:text-[#db4444]'
                }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-white text-[#db4444] shadow-sm'
                  : 'text-gray-600 hover:text-[#db4444]'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
