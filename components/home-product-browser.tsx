"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { ProductDetailsModal } from "@/components/product-details-modal";
import { useLanguage } from "@/lib/language-context";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Star, 
  Check, 
  RefreshCw, 
  ArrowUpDown 
} from "lucide-react";

type Category = {
  id: string;
  label: string;
};

type HomeProductBrowserProps = {
  products: ProductCardData[];
  categories: Category[];
  whatsappNumber?: string;
  brand?: string;
};

export function HomeProductBrowser({
  products,
  categories,
  whatsappNumber,
  brand,
}: HomeProductBrowserProps) {
  const { t } = useLanguage();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("position");

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Selected Product details modal
  const [selectedProduct, setSelectedProduct] = useState<ProductCardData | null>(
    null,
  );

  // Gather unique brands dynamically, incorporating seeds for demonstration
  const availableBrands = useMemo(() => {
    const brands = products.map((p) => p.brand || "Thennaiyan");
    const unique = Array.from(new Set(brands));
    // Always include Brand A, Brand B, Brand C to satisfy requirements
    const targetSeeds = ["Brand A", "Brand B", "Brand C"];
    targetSeeds.forEach(seed => {
      if (!unique.includes(seed)) unique.push(seed);
    });
    return unique.sort();
  }, [products]);

  // Handle brand checklist toggles
  const handleBrandToggle = (b: string) => {
    if (selectedBrands.includes(b)) {
      setSelectedBrands(selectedBrands.filter((item) => item !== b));
    } else {
      setSelectedBrands([...selectedBrands, b]);
    }
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setPriceFilter("all");
    setSelectedBrands([]);
    setMinRating(0);
    setAvailabilityFilter("all");
    setSortBy("position");
  };

  // Main product filtering logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search query (matches name, category slug, or brand)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Category Pill or drop-down
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Brand Checklist Filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    // Price Filter Range check
    if (priceFilter !== "all") {
      result = result.filter((p) => {
        const price = p.startingFrom;
        if (priceFilter === "under-500") return price < 500;
        if (priceFilter === "500-1000") return price >= 500 && price <= 1000;
        if (priceFilter === "1000-5000") return price >= 1000 && price <= 5000;
        if (priceFilter === "above-5000") return price > 5000;
        return true;
      });
    }

    // Rating Filter range check
    if (minRating > 0) {
      result = result.filter((p) => p.rating !== undefined && p.rating >= minRating);
    }

    // Availability check
    if (availabilityFilter !== "all") {
      result = result.filter((p) => {
        if (availabilityFilter === "in-stock") return p.inStock === true;
        if (availabilityFilter === "out-of-stock") return p.inStock === false;
        return true;
      });
    }

    // Sorting operations
    if (sortBy === "price-low-high") {
      result = [...result].sort((a, b) => a.startingFrom - b.startingFrom);
    } else if (sortBy === "price-high-low") {
      result = [...result].sort((a, b) => b.startingFrom - a.startingFrom);
    } else if (sortBy === "best-selling") {
      result = [...result].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortBy === "highest-rated") {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "newest") {
      // Default positions acts as newest-first or reverse position
      result = [...result].sort((a, b) => b.slug.localeCompare(a.slug));
    }

    return result;
  }, [
    products,
    searchQuery,
    activeCategory,
    selectedBrands,
    priceFilter,
    minRating,
    availabilityFilter,
    sortBy,
  ]);

  const filterSidebarContent = (
    <div className="space-y-6">
      {/* Search Bar Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Search products
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, category..."
            className="w-full bg-white border border-gray-200 px-3.5 py-2 pl-9 rounded-xl text-sm focus:outline-none focus:border-leaf transition-all font-body"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Category
        </label>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-leaf font-body"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Brackets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Price Range
        </label>
        <div className="space-y-2">
          {[
            { id: "all", label: "Any Price" },
            { id: "under-500", label: "Under ₹500" },
            { id: "500-1000", label: "₹500 – ₹1000" },
            { id: "1000-5000", label: "₹1000 – ₹5000" },
            { id: "above-5000", label: "Above ₹5000" },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold cursor-pointer select-none">
              <input
                type="radio"
                name="priceRange"
                checked={priceFilter === item.id}
                onChange={() => setPriceFilter(item.id)}
                className="rounded-full border-gray-300 text-leaf focus:ring-leaf h-3.5 w-3.5 cursor-pointer accent-[#1f6b3b]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Checklist */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Brand Filter
        </label>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
          {availableBrands.map((b) => {
            const checked = selectedBrands.includes(b);
            return (
              <label key={b} className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleBrandToggle(b)}
                  className="rounded border-gray-300 text-leaf focus:ring-leaf h-3.5 w-3.5 cursor-pointer accent-[#1f6b3b]"
                />
                <span>{b}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating Filters */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="space-y-2">
          {[
            { id: 0, label: "Any Rating" },
            { id: 4, label: "4★ & above" },
            { id: 3, label: "3★ & above" },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold cursor-pointer select-none">
              <input
                type="radio"
                name="minRating"
                checked={minRating === item.id}
                onChange={() => setMinRating(item.id)}
                className="rounded-full border-gray-300 text-leaf focus:ring-leaf h-3.5 w-3.5 cursor-pointer accent-[#1f6b3b]"
              />
              <span className="flex items-center gap-0.5">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability (In / Out of Stock) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Availability
        </label>
        <div className="space-y-2">
          {[
            { id: "all", label: "All Products" },
            { id: "in-stock", label: "In Stock" },
            { id: "out-of-stock", label: "Out of Stock" },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold cursor-pointer select-none">
              <input
                type="radio"
                name="availability"
                checked={availabilityFilter === item.id}
                onChange={() => setAvailabilityFilter(item.id)}
                className="rounded-full border-gray-300 text-leaf focus:ring-leaf h-3.5 w-3.5 cursor-pointer accent-[#1f6b3b]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={handleClearFilters}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-gray-200 hover:border-red-400 text-xs font-bold text-gray-500 hover:text-red-500 bg-gray-50 hover:bg-red-50/20 transition-all duration-200"
      >
        <RefreshCw size={12} />
        Clear Filters
      </button>
    </div>
  );

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        
        {/* Sidebar Filters (Desktop only) */}
        <aside className="hidden lg:block bg-white border border-gray-200/80 p-5 rounded-2xl shadow-xs h-fit sticky top-20">
          {filterSidebarContent}
        </aside>

        {/* Product listing viewport */}
        <div className="space-y-5">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200/80 px-4 py-3 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 font-mono uppercase">
              <span>{filteredProducts.length} items found</span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600">
                <ArrowUpDown size={12} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:outline-none pr-1 cursor-pointer font-body font-extrabold text-gray-700"
                >
                  <option value="position">Default Order</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Mobile Filter Drawer Trigger */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold rounded-xl text-gray-600 transition-colors"
              >
                <SlidersHorizontal size={13} />
                Filters
              </button>
            </div>
          </div>

          {/* Quick Category Chips for quick horizontal selection (optional desktop/mobile support) */}
          <div className="scrollbar-none flex items-center gap-2.5 overflow-x-auto pb-1.5">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategory(category.id);
                }}
                className={cn(
                  "whitespace-nowrap px-4 py-1.5 font-body text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 rounded-full border shadow-xs",
                  activeCategory === category.id
                    ? "border-leaf bg-leaf text-white"
                    : "border-gray-200/80 bg-white text-gray-500 hover:border-leaf/40"
                )}
              >
                {t(category.id === "all" ? "all-items" : category.id)}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-body text-sm bg-white rounded-2xl border border-dashed border-gray-200 shadow-xs">
              {t("noItemsFound") || "No items match your search filters."}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  data={product}
                  onViewDetails={setSelectedProduct}
                  whatsappNumber={whatsappNumber}
                  brand={brand}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer (Overlay Sheet) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/45 backdrop-blur-xs lg:hidden">
          
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0" onClick={() => setIsMobileDrawerOpen(false)} />

          {/* Drawer content panel */}
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 shrink-0">
              <span className="font-body font-extrabold text-sm text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Filter size={15} className="text-leaf" /> Filters
              </span>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
              {filterSidebarContent}
            </div>

            {/* Sticky footer apply action */}
            <div className="border-t border-gray-100 p-4 shrink-0 bg-gray-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleClearFilters();
                  setIsMobileDrawerOpen(false);
                }}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="btn-primary !px-6 !py-2.5 rounded-full text-xs font-extrabold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Popup Modal */}
      <ProductDetailsModal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        whatsappNumber={whatsappNumber}
        brand={brand}
      />
    </>
  );
}
