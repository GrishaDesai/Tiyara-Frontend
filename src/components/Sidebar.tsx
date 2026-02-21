import React, { useState, useEffect } from 'react';
import type { FC, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, DollarSign, Tag, Percent, Menu } from 'lucide-react';
import useDebounce from '../hooks/useDebounce'; 

interface Product {
    BrandName?: string;
    Individual_category?: string;
    tags?: string;
    OriginalPrice?: number | string;
    Ratings?: number | string;
    DiscountOffer?: string;
}

interface PriceRange {
    min: string;
    max: string;
}

interface SidebarProps {
    products: Product[] | null;
    setFilteredProducts: (products: Product[]) => void;
    resetFilters: () => void;
}

const Sidebar: FC<SidebarProps> = ({ products, setFilteredProducts, resetFilters }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [priceRange, setPriceRange] = useState<PriceRange>({ min: '', max: '' });
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [ratingFilter, setRatingFilter] = useState<string>('');
    const [discountFilter, setDiscountFilter] = useState<string>('');
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    // Debounce the search term with a 300ms delay
    const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

    // Extract and sort available brands from products (A to Z)
    useEffect(() => {
        if (products && products.length > 0) {
            const brands = [...new Set(products.map((product) => product.BrandName).filter((brand): brand is string => !!brand))].sort(
                (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })
            );
            setAvailableBrands(brands);
        } else {
            setAvailableBrands([]);
        }
    }, [products]);

    // Apply filters when debounced search term or other filters change
    useEffect(() => {
        applyAllFilters(debouncedSearchTerm, priceRange, selectedBrands, ratingFilter, discountFilter);
    }, [debouncedSearchTerm, priceRange, selectedBrands, ratingFilter, discountFilter, products]);

    // Handle search input change
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Price range filter
    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const value = e.target.value;
        setPriceRange((prev) => ({
            ...prev,
            [type]: value,
        }));
    };

    // Brand filter
    const toggleBrandSelection = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    // Rating filter
    const handleRatingChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setRatingFilter(e.target.value);
    };

    // Discount filter
    const handleDiscountChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setDiscountFilter(e.target.value);
    };

    // Toggle drawer
    const toggleDrawer = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsDrawerOpen((prev) => !prev);
    };

    // Apply all filters with updated search logic
    const applyAllFilters = (
        search: string,
        price: PriceRange,
        brands: string[],
        rating: string,
        discount: string
    ) => {
        if (!products) {
            setFilteredProducts([]);
            return;
        }

        let filtered = [...products];

        // Apply enhanced search filter
        if (search.trim()) {
            const normalize = (str: string | undefined): string => {
                if (!str) return '';
                return str
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .replace(/\bt[\s-]*shirt\b/gi, 'tshirt')
                    .replace(/\btops\b/gi, 'top')
                    .replace(/\btshirts\b/gi, 'tshirt')
                    .trim();
            };

            const searchWords = normalize(search).split(' ').filter((word) => word);
            // console.log('Normalized search words:', searchWords);

            filtered = filtered.filter((product) => {
                const brandText = product?.BrandName ? normalize(product.BrandName) : '';
                const processCategory = product?.Individual_category ? normalize(product.Individual_category) : '';
                const tagsText = product?.tags ? normalize(product.tags) : '';
                const allText = normalize(`${brandText} ${processCategory} ${tagsText}`);
                // console.log('Product text:', allText);

                // Use 'some' to align with Navbar.tsx (match any word)
                const hasMatch = searchWords.some((word) => {
                    const matches = allText.includes(word);
                    // console.log(`Checking word "${word}" in "${allText}": ${matches}`);
                    return matches;
                });

                return hasMatch;
            });
        }

        // Apply price filter
        if (price.min) {
            filtered = filtered.filter((product) => Number(product.OriginalPrice) >= Number(price.min));
        }
        if (price.max) {
            filtered = filtered.filter((product) => Number(product.OriginalPrice) <= Number(price.max));
        }

        // Apply brand filter
        if (brands.length > 0) {
            filtered = filtered.filter((product) => brands.includes(product.BrandName || ''));
        }

        // Apply rating filter
        if (rating) {
            filtered = filtered.filter((product) => Number(product.Ratings) >= Number(rating));
        }

        // Apply discount filter
        if (discount) {
            filtered = filtered.filter((product) => {
                const discountPercentage = parseInt(product.DiscountOffer?.match(/\d+/)?.[0] || '0');
                return discountPercentage >= Number(discount);
            });
        }

        // console.log('Filtered products:', filtered);
        setFilteredProducts(filtered);
    };

    // Clear all filters
    const handleClearFilters = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSearchTerm('');
        setPriceRange({ min: '', max: '' });
        setSelectedBrands([]);
        setRatingFilter('');
        setDiscountFilter('');
        resetFilters();
    };

    return (
        <>
            {/* Drawer Toggle Button (Visible on md and smaller) */}
            <button
                className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-wine text-ivory rounded-lg shadow-lg hover:bg-plum transition-colors duration-200"
                onClick={toggleDrawer}
            >
                <Menu size={24} />
            </button>

            {/* Drawer for Mobile (md and smaller) */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-wine to-plum shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:hidden`}
            >
                <div className="p-3 h-full overflow-y-auto">
                    {/* Close Drawer Button */}
                    <button
                        className="absolute top-4 right-4 text-ivory hover:text-blush"
                        onClick={toggleDrawer}
                    >
                        <X size={24} />
                    </button>

                    {/* Sidebar Content */}
                    <div className="space-y-6">
                        {/* Logo */}
                        <div
                            className="text-2xl font-bold text-blush hover:text-ivory transition-colors duration-300 cursor-pointer text-center border-b border-mauve/30 pb-4"
                            onClick={() => {
                                navigate('/');
                                setIsDrawerOpen(false);
                            }}
                        >
                            Shop Smart
                        </div>

                        {/* Search Bar */}
                        <div>
                            <div className="flex items-center mb-3">
                                <Search className="text-ivory mr-2" size={18} />
                                <h3 className="text-lg font-semibold text-ivory">Search</h3>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products, brands..."
                                    className="w-full pl-10 pr-10 py-3 border border-mauve rounded-lg focus:outline-none focus:ring-2 focus:ring-lightLavender bg-white/90 placeholder-gray-500 text-gray-800"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                {searchTerm && (
                                    <X
                                        className="absolute right-3 top-3.5 text-gray-500 cursor-pointer hover:text-plum transition-colors duration-200"
                                        size={18}
                                        onClick={() => {
                                            setSearchTerm('');
                                            applyAllFilters('', priceRange, selectedBrands, ratingFilter, discountFilter);
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="space-y-6">
                            {/* Price Range Filter */}
                            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                <div className="flex items-center mb-4">
                                    <DollarSign className="text-ivory mr-2" size={18} />
                                    <h3 className="text-lg font-semibold text-ivory">Price Range</h3>
                                </div>
                                <div className="flex space-x-3">
                                    <div className="flex-1">
                                        <label className="text-sm text-blush mb-1 block">Min Price</label>
                                        <input
                                            type="number"
                                            placeholder="₹0"
                                            className="w-full px-3 py-2 border border-mauve rounded-md focus:outline-none focus:ring-2 focus:ring-lightLavender bg-white/90 text-gray-800"
                                            value={priceRange.min}
                                            onChange={(e) => handlePriceChange(e, 'min')}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-sm text-blush mb-1 block">Max Price</label>
                                        <input
                                            type="number"
                                            placeholder="₹∞"
                                            className="w-full px-3 py-2 border border-mauve rounded-md focus:outline-none focus:ring-2 focus:ring-lightLavender bg-white/90 text-gray-800"
                                            value={priceRange.max}
                                            onChange={(e) => handlePriceChange(e, 'max')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                <div className="flex items-center mb-4">
                                    <Tag className="text-ivory mr-2" size={18} />
                                    <h3 className="text-lg font-semibold text-ivory">Brands</h3>
                                </div>
                                <div className="max-h-48 overflow-y-auto border border-mauve/30 rounded-md p-3 bg-white/80 scrollbar-thin scrollbar-thumb-wine scrollbar-track-blush">
                                    {availableBrands.length > 0 ? (
                                        availableBrands.map((brand, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center mb-2 hover:bg-moonstone/30 px-2 py-1 rounded transition-colors duration-200"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`brand-${index}`}
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() => toggleBrandSelection(brand)}
                                                    className="mr-3 accent-wine w-4 h-4"
                                                />
                                                <label
                                                    htmlFor={`brand-${index}`}
                                                    className="text-sm text-gray-800 cursor-pointer font-medium flex-1"
                                                >
                                                    {brand}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic text-center py-4">No brands available</p>
                                    )}
                                </div>
                                {selectedBrands.length > 0 && (
                                    <div className="mt-3 text-xs text-blush">
                                        {selectedBrands.length} brand{selectedBrands.length > 1 ? 's' : ''} selected
                                    </div>
                                )}
                            </div>

                            {/* Rating Filter */}
                            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                <div className="flex items-center mb-4">
                                    <Star className="text-ivory mr-2" size={18} />
                                    <h3 className="text-lg font-semibold text-ivory">Minimum Rating</h3>
                                </div>
                                <select
                                    className="w-full px-3 py-3 border border-mauve rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-lightLavender text-gray-800"
                                    value={ratingFilter}
                                    onChange={handleRatingChange}
                                >
                                    <option value="">All Ratings</option>
                                    <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                                    <option value="3">⭐⭐⭐ 3+ Stars</option>
                                    <option value="2">⭐⭐ 2+ Stars</option>
                                    <option value="1">⭐ 1+ Star</option>
                                </select>
                            </div>

                            {/* Discount Filter */}
                            <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                                <div className="flex items-center mb-4">
                                    <Percent className="text-ivory mr-2" size={18} />
                                    <h3 className="text-lg font-semibold text-ivory">Minimum Discount</h3>
                                </div>
                                <select
                                    className="w-full px-3 py-3 border border-mauve rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-lightLavender text-gray-800"
                                    value={discountFilter}
                                    onChange={handleDiscountChange}
                                >
                                    <option value="">All Discounts</option>
                                    <option value="50">🔥 50% or more</option>
                                    <option value="30">💰 30% or more</option>
                                    <option value="20">💸 20% or more</option>
                                    <option value="10">💵 10% or more</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <button
                            className="w-full bg-gradient-to-r from-plum to-wine text-white px-6 py-3 rounded-lg hover:from-wine hover:to-plum transition-all duration-300 text-lg font-semibold shadow-lg flex items-center justify-center mt-6 transform hover:scale-105"
                            onClick={handleClearFilters}
                        >
                            <X size={20} className="mr-2" />
                            Clear All Filters
                        </button>

                        {/* Active Filters Summary */}
                        <div className="mt-6 p-4 bg-white/5 rounded-lg">
                            <h4 className="text-sm font-semibold text-blush mb-2">Active Filters:</h4>
                            <div className="text-xs text-ivory space-y-1">
                                {searchTerm && <div>• Search: "{searchTerm}"</div>}
                                {(priceRange.min || priceRange.max) && (
                                    <div>• Price: ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}</div>
                                )}
                                {selectedBrands.length > 0 && (
                                    <div>• Brands: {selectedBrands.length} selected</div>
                                )}
                                {ratingFilter && <div>• Rating: {ratingFilter}+ stars</div>}
                                {discountFilter && <div>• Discount: {discountFilter}%+ off</div>}
                                {!searchTerm &&
                                    !priceRange.min &&
                                    !priceRange.max &&
                                    selectedBrands.length === 0 &&
                                    !ratingFilter &&
                                    !discountFilter && <div className="text-gray-400">None</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for Drawer (md and smaller) */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={toggleDrawer}
                ></div>
            )}

            {/* Fixed Sidebar for Desktop (md and larger) */}
            <div className="hidden md:block h-[95vh] w-[1/3] bg-gradient-to-b from-wine to-plum shadow-xl overflow-y-auto">
                <div className="p-3">
                    {/* Logo */}
                    <div
                        className="text-2xl font-bold text-blush hover:text-ivory transition-colors duration-300 cursor-pointer mb-8 text-center border-b border-mauve/30 pb-4"
                        onClick={() => navigate('/')}
                    >
                        Shop Smart
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="flex items-center mb-3">
                            <Search className="text-ivory mr-2" size={18} />
                            <h3 className="text-lg font-semibold text-ivory">Search</h3>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products, brands..."
                                className="w-full pl-10 pr-10 py-3 border border-mauve rounded-lg focus:outline-none focus:ring-2 focus:ring-lightLavender bg-white/90 placeholder-gray-500 text-gray-800"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            {searchTerm && (
                                <X
                                    className="absolute right-3 top-3.5 text-gray-500 cursor-pointer hover:text-plum transition-colors duration-200"
                                    size={18}
                                    onClick={() => {
                                        setSearchTerm('');
                                        applyAllFilters('', priceRange, selectedBrands, ratingFilter, discountFilter);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="space-y-8">
                        {/* Price Range Filter */}
                        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                            <div className="flex items-center mb-4">
                                <DollarSign className="text-ivory mr-2" size={18} />
                                <h3 className="text-lg font-semibold text-ivory">Price Range</h3>
                            </div>
                            <div className="flex space-x-3">
                                <div className="flex-1">
                                    <label className="text-sm text-blush mb-1 block">Min Price</label>
                                    <input
                                        type="number"
                                        placeholder="₹0"
                                        className="w-full px-3 py-2 border border-mauve rounded-md focus:outline-none focus:ring-2 focus:ring-lightLavender bg-white/90 text-gray-800"
                                        value={priceRange.min}
                                        onChange={(e) => handlePriceChange(e, 'min')}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm text-blush mb-1 block">Max Price</label>
                                    <input
                                        type="number"
                                        placeholder="₹∞"
                                        className="w-full px-3 py-2 border border-mauve rounded-md focus:outline-none focus:ring-2 focus:ring-lightLavender bg-white/90 text-gray-800"
                                        value={priceRange.max}
                                        onChange={(e) => handlePriceChange(e, 'max')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                            <div className="flex items-center mb-4">
                                <Tag className="text-ivory mr-2" size={18} />
                                <h3 className="text-lg font-semibold text-ivory">Brands</h3>
                            </div>
                            <div className="max-h-48 overflow-y-auto border border-mauve/30 rounded-md p-3 bg-white/80 scrollbar-thin scrollbar-thumb-wine scrollbar-track-blush">
                                {availableBrands.length > 0 ? (
                                    availableBrands.map((brand, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center mb-2 hover:bg-moonstone/30 px-2 py-1 rounded transition-colors duration-200"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`brand-${index}`}
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrandSelection(brand)}
                                                className="mr-3 accent-wine w-4 h-4"
                                            />
                                            <label
                                                htmlFor={`brand-${index}`}
                                                className="text-sm text-gray-800 cursor-pointer font-medium flex-1"
                                            >
                                                {brand}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center py-4">No brands available</p>
                                )}
                            </div>
                            {selectedBrands.length > 0 && (
                                <div className="mt-3 text-xs text-blush">
                                    {selectedBrands.length} brand{selectedBrands.length > 1 ? 's' : ''} selected
                                </div>
                            )}
                        </div>

                        {/* Rating Filter */}
                        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                            <div className="flex items-center mb-4">
                                <Star className="text-ivory mr-2" size={18} />
                                <h3 className="text-lg font-semibold text-ivory">Minimum Rating</h3>
                            </div>
                            <select
                                className="w-full px-3 py-3 border border-mauve rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-lightLavender text-gray-800"
                                value={ratingFilter}
                                onChange={handleRatingChange}
                            >
                                <option value="">All Ratings</option>
                                <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                                <option value="3">⭐⭐⭐ 3+ Stars</option>
                                <option value="2">⭐⭐ 2+ Stars</option>
                                <option value="1">⭐ 1+ Star</option>
                            </select>
                        </div>

                        {/* Discount Filter */}
                        <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                            <div className="flex items-center mb-4">
                                <Percent className="text-ivory mr-2" size={18} />
                                <h3 className="text-lg font-semibold text-ivory">Minimum Discount</h3>
                            </div>
                            <select
                                className="w-full px-3 py-3 border border-mauve rounded-md bg-white/90 focus:outline-none focus:ring-2 focus:ring-lightLavender text-gray-800"
                                value={discountFilter}
                                onChange={handleDiscountChange}
                            >
                                <option value="">All Discounts</option>
                                <option value="50">🔥 50% or more</option>
                                <option value="30">💰 30% or more</option>
                                <option value="20">💸 20% or more</option>
                                <option value="10">💵 10% or more</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        className="w-full bg-gradient-to-r from-plum to-wine text-white px-6 py-3 rounded-lg hover:from-wine hover:to-plum transition-all duration-300 text-lg font-semibold shadow-lg flex items-center justify-center mt-8 transform hover:scale-105"
                        onClick={handleClearFilters}
                    >
                        <X size={20} className="mr-2" />
                        Clear All Filters
                    </button>

                    {/* Active Filters Summary */}
                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                        <h4 className="text-sm font-semibold text-blush mb-2">Active Filters:</h4>
                        <div className="text-xs text-ivory space-y-1">
                            {searchTerm && <div>• Search: "{searchTerm}"</div>}
                            {(priceRange.min || priceRange.max) && (
                                <div>• Price: ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}</div>
                            )}
                            {selectedBrands.length > 0 && (
                                <div>• Brands: {selectedBrands.length} selected</div>
                            )}
                            {ratingFilter && <div>• Rating: {ratingFilter}+ stars</div>}
                            {discountFilter && <div>• Discount: {discountFilter}%+ off</div>}
                            {!searchTerm &&
                                !priceRange.min &&
                                !priceRange.max &&
                                selectedBrands.length === 0 &&
                                !ratingFilter &&
                                !discountFilter && <div className="text-gray-400">None</div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;