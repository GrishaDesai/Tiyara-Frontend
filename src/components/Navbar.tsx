import { useState, useEffect, useRef } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Camera, ShoppingBag, Heart, User, LogOut, ChevronDown } from 'lucide-react';
import logo from '../assets/image/logo.png';
import type { Product } from '../types/product';
import { useAuth, useCart } from '../hooks/useStore';
import { useAuthModal } from '../hooks/useAuthModal';
import AuthModal from './Authmodal';

export interface NavbarProps {
  products?: Product[] | null;
  setFilteredProducts?: (products: Product[]) => void;
  resetFilters?: () => void;
}

const Navbar: FC<NavbarProps> = ({ products, setFilteredProducts, resetFilters }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, wishlistItems } = useCart();
  const navigate = useNavigate();

  const { authModal, openAuth, closeAuth } = useAuthModal();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) { setFilteredProducts?.(products || []); return; }
    if (!products || !Array.isArray(products)) { setFilteredProducts?.(products || []); return; }

    const normalize = (str?: string) =>
      (str || '').toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/\bt[\s-]*shirt\b/gi, 'tshirt')
        .replace(/\btops\b/gi, 'top')
        .replace(/\btshirts\b/gi, 'tshirt')
        .trim();

    const searchWords = normalize(value).split(' ').filter(Boolean);
    const filtered = products.filter(p =>
      searchWords.some(w => normalize(p?.tags).includes(w))
    );
    setFilteredProducts?.(filtered);
  };

  const handleClearSearch = () => { setSearchTerm(''); resetFilters?.(); };
  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/'); };

  const navLinks = [
    { name: 'Home', link: '/' },
    { name: 'Products', link: '/product' },
    { name: 'Categories', link: '/category' },
    { name: 'Contact', link: '/' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full px-4 md:px-6 flex items-center justify-between z-50 transition-all duration-300 ${scrolled ? 'bg-white/10 backdrop-blur-md shadow-md' : 'bg-blush mb-4'
          }`}
        style={{ height: '4rem' }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" onClick={() => navigate('/')} />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10 flex-grow justify-center">
          <ul className="flex items-center gap-8 text-lg text-wine font-medium">
            {navLinks.map((item, i) => (
              <li key={i} className="relative group">
                <a href={item.link} className="hover:text-gray-300 transition-all duration-300">{item.name}</a>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-ivory transition-all duration-300 group-hover:w-full" />
              </li>
            ))}
          </ul>

          {/* Search */}
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
                <button className="text-wine hover:text-gray-600" onClick={handleClearSearch}>
                  <X size={18} />
                </button>
              )}
              {/* Camera — directly navigate to image-rec */}
              <button
                className="text-wine hover:text-gray-600"
                onClick={() => navigate('/image-rec')}
                title="Search by image"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {isAuthenticated ? (
            <>
              <button className="relative text-wine hover:text-wine/70 transition-colors" onClick={() => navigate('/wishlist')}>
                <Heart size={22} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-wine text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button className="relative text-wine hover:text-wine/70 transition-colors" onClick={() => navigate('/cart')}>
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-wine text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(p => !p)}
                  className="flex items-center gap-1.5 border border-wine text-wine rounded-md px-3 py-1.5 text-sm hover:bg-wine hover:text-white transition-all"
                >
                  <User size={15} />
                  <span className="max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={13} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-44 z-50">
                    <button onClick={() => { navigate('/profile'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blush hover:text-wine transition-colors flex items-center gap-2">
                      <User size={14} /> Profile
                    </button>
                    <button onClick={() => { navigate('/wishlist'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blush hover:text-wine transition-colors flex items-center gap-2">
                      <Heart size={14} /> Wishlist
                    </button>
                    <button onClick={() => { navigate('/cart'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blush hover:text-wine transition-colors flex items-center gap-2">
                      <ShoppingBag size={14} /> Cart
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => openAuth('login')} className="px-3 lg:px-5 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all text-sm lg:text-base">
                Login
              </button>
              <button onClick={() => openAuth('signup')} className="px-3 lg:px-5 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all text-sm lg:text-base">
                Signup
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-wine text-2xl p-2" onClick={() => setMobileMenuOpen(p => !p)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-16 right-0 h-screen w-full md:w-64 bg-blush shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-5">
          <ul className="flex flex-col space-y-4 mb-6">
            {navLinks.map((item, i) => (
              <li key={i}>
                <a href={item.link} className="text-wine text-lg font-medium block py-2 hover:text-gray-300 transition-all" onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border rounded-lg border-wine px-2 py-2 w-full mb-6">
            <Search className="text-wine mr-2" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-wine placeholder-gray-500 focus:outline-none w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && <button className="text-wine" onClick={handleClearSearch}><X size={18} /></button>}
            {/* Camera — directly navigate to image-rec */}
            <button
              className="text-wine ml-1"
              onClick={() => { navigate('/image-rec'); setMobileMenuOpen(false); }}
              title="Search by image"
            >
              <Camera size={18} />
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <button onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-wine text-sm py-2">
                <ShoppingBag size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
              </button>
              <button onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-wine text-sm py-2">
                <Heart size={16} /> Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 text-sm py-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={() => { openAuth('login'); setMobileMenuOpen(false); }} className="w-full px-5 py-2 border border-wine text-wine rounded-md hover:bg-wine hover:text-white transition-all">Login</button>
              <button onClick={() => { openAuth('signup'); setMobileMenuOpen(false); }} className="w-full px-5 py-2 bg-wine text-white rounded-md hover:bg-opacity-80 transition-all">Signup</button>
            </div>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <AuthModal isOpen={authModal.open} onClose={closeAuth} defaultTab={authModal.tab} />
    </>
  );
};

export default Navbar;