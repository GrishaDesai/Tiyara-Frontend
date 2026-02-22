import { useState, useEffect } from 'react';
import type { FC, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Camera } from 'lucide-react';
import logo from '../assets/image/logo.png';
import type { Product } from '../types/product';

export interface NavbarProps {
  products?: Product[] | null;
  setFilteredProducts?: (products: Product[]) => void;
  resetFilters?: () => void;
}

const Navbar: FC<NavbarProps> = ({ products, setFilteredProducts, resetFilters }) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search functionality
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    console.log('Search term:', value);

    // If search term is empty, reset to all products
    if (!value.trim()) {
      console.log('Empty search, resetting to all products');
      if (setFilteredProducts) {
        setFilteredProducts(products || []);
      }
      return;
    }

    // Ensure products array exists
    if (!products || !Array.isArray(products)) {
      console.log('Products array is invalid or empty');
      if (setFilteredProducts) {
        setFilteredProducts(products || []);
      }
      return;
    }

    // Helper function to normalize text
    const normalize = (str: string | undefined): string => {
      if (!str) return '';
      return str
        .toLowerCase()
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/\bt[\s-]*shirt\b/gi, 'tshirt') // Handle t-shirt, t shirt, etc.
        .replace(/\btops\b/gi, 'top') // Handle tops -> top
        .replace(/\btshirts\b/gi, 'tshirt') // Handle tshirts -> tshirt
        .trim();
    };

    // Normalize and split search terms
    const searchWords = normalize(value)
      .split(' ')
      .filter((word) => word); // Remove empty words
    console.log('Normalized search words:', searchWords);

    // Filter products
    let filtered = [...products]; // Create a copy of products array

    filtered = filtered.filter((product) => {
      // Normalize product fields with null checks
      const tagsText = product?.tags ? normalize(product.tags) : '';

      // Combine all searchable text and ensure it's lowercase
      console.log('Product text:', tagsText);

      // Check if at least one search word is found in the combined text
      const hasMatch = searchWords.some((word) => {
        const matches = tagsText.includes(word);
        console.log(`Checking word "${word}" in "${tagsText}": ${matches}`);
        return matches;
      });

      return hasMatch;
    });

    console.log('Filtered products:', filtered);
    if (setFilteredProducts) {
      setFilteredProducts(products || []);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    resetFilters?.();
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Handle image upload popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files ? e.target.files[0] : null);
  };

  const handleUpload = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    // Pass the selected file to the img-rec component via navigation state
    navigate('/image-rec', { state: { imageFile: selectedFile } });
    closePopup();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full px-4 md:px-6 flex items-center justify-between z-50 transition-all duration-300 ${scrolled ? 'bg-white/10 backdrop-blur-md shadow-md' : 'bg-blush mb-4'
          }`}
        style={{ height: '4rem' }}
      >
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Desktop Menu - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-10 flex-grow justify-center">
          <ul className="flex items-center gap-8 text-lg text-wine font-medium">
            {[
              { name: 'Home', link: '/' },
              { name: 'Products', link: '/product' },
              { name: 'Categories', link: '/category' },
              { name: 'Contact', link: '/' },
            ].map((item, index) => (
              <li key={index} className="relative group">
                <a
                  href={item.link}
                  className="hover:text-gray-300 transition-all duration-300"
                >
                  {item.name}
                </a>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-ivory transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* Search Bar - Shown on medium+ screens */}
          <div className="hidden lg:flex items-center justify-between border rounded-lg border-wine px-2 py-2 w-64 xl:w-80 focus-within:border-wine">
            <Search className="text-wine mr-2" size={18} />
            <input
              type="text"
              placeholder="Search products, brands, or tags..."
              className="bg-transparent text-wine placeholder-gray-500 focus:outline-none w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="flex gap-2">
              {searchTerm && (
                <button
                  className="text-wine hover:text-gray-600 transition-all"
                  onClick={handleClearSearch}
                >
                  <X size={18} />
                </button>
              )}
              <button
                className="text-wine hover:text-gray-600 transition-all"
                onClick={openPopup}
              >
                <Camera size={18} />
              </button>

            </div>
          </div>
        </div>

        {/* Right: Login & Signup Buttons - Hidden on mobile */}
        <div className="hidden md:flex gap-3 lg:gap-5">
          <button className="px-3 lg:px-5 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all text-sm lg:text-base">
            Login
          </button>
          <button className="px-3 lg:px-5 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all text-sm lg:text-base">
            Signup
          </button>
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          className="md:hidden text-wine text-2xl p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <span>✕</span> : <span>☰</span>}
        </button>
      </nav>

      {/* Mobile Menu - Slide in from right */}
      <div
        className={`fixed top-16 right-0 h-screen w-full md:w-64 bg-blush shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col p-5">
          {/* Mobile Navigation Links */}
          <ul className="flex flex-col space-y-4 mb-6">
            {[
              { name: 'Home', link: '/' },
              { name: 'Products', link: '/allProducts' },
              { name: 'Categories', link: '/category' },
              { name: 'Contact', link: '/' },
            ].map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="text-wine text-lg font-medium block py-2 hover:text-gray-300 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Search */}
          <div className="flex items-center justify-between border rounded-lg border-wine px-2 py-2 w-full mb-6 focus-within:border-wine">
            <Search className="text-wine mr-2" size={18} />
            <input
              type="text"
              placeholder="Search products, brands, or tags..."
              className="bg-transparent text-wine placeholder-gray-500 focus:outline-none w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="flex gap-2">
              {searchTerm && (
                <button
                  className="text-wine hover:text-gray-600 transition-all"
                  onClick={handleClearSearch}
                >
                  <X size={18} />
                </button>
              )}
              <button
                className="text-wine hover:text-gray-600 transition-all"
                onClick={openPopup}
              >
                <i className="fa fa-camera" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full px-5 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all">
              Login
            </button>
            <button className="w-full px-5 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all">
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu background */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Image Upload Popup */}
      {isPopupOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closePopup}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-wine font-medium">Upload Image</h2>
              <button
                className="text-wine hover:text-gray-600"
                onClick={closePopup}
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                className="w-full text-wine"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;