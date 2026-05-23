import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import About from './pages/About';

function Navigation({ cart, theme, toggleTheme }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const uniqueCartCount = new Set(cart.map(item => item._id || item.id)).size;

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-16 md:h-24 w-full flex-row items-center justify-between bg-white dark:bg-stone-900 px-4 md:px-8 transition-colors duration-300 border-b border-transparent dark:border-stone-800 gap-2 md:gap-0">
      
      <div className="flex w-auto md:w-1/4 justify-start shrink-0">
        <Link to="/" className="focus:outline-none cursor-pointer">
          <span className="text-gray-900 dark:text-stone-100 font-black text-xl tracking-wider uppercase transition-colors">
            <span className="md:hidden">B<span className="text-orange-600">S</span></span>
            <span className="hidden md:inline">Burger<span className="text-orange-600">Spot</span></span>
          </span>
        </Link>
      </div>

      <div className="relative flex-1 flex mx-2 md:mx-0 overflow-hidden md:justify-center">
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-stone-900 to-transparent md:hidden z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-stone-900 to-transparent md:hidden z-10 pointer-events-none"></div>

        <div className="flex flex-row items-center justify-start md:justify-center gap-6 md:gap-8 text-sm font-bold tracking-[0.2em] uppercase overflow-x-auto whitespace-nowrap px-6 md:px-0 w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link 
            to="/" 
            className={`transition-all duration-200 cursor-pointer shrink-0 ${currentPath === '/' ? 'text-orange-600 opacity-100' : 'opacity-30 dark:opacity-50 hover:opacity-80 dark:text-stone-100'}`}
          >
            ГЛАВНАЯ
          </Link>
          <Link 
            to="/menu" 
            className={`transition-all duration-200 cursor-pointer shrink-0 ${currentPath === '/menu' ? 'text-orange-600 opacity-100' : 'opacity-30 dark:opacity-50 hover:opacity-80 dark:text-stone-100'}`}
          >
            МЕНЮ
          </Link>
          <Link 
            to="/about" 
            className={`transition-all duration-200 cursor-pointer shrink-0 ${currentPath === '/about' ? 'text-orange-600 opacity-100' : 'opacity-30 dark:opacity-50 hover:opacity-80 dark:text-stone-100'}`}
          >
            О НАС
          </Link>
        </div>
      </div>

      <div className="flex w-auto md:w-1/4 justify-end items-center gap-4 md:gap-6 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          className="text-gray-400 hover:text-gray-900 dark:text-stone-500 dark:hover:text-stone-100 transition-colors duration-200 cursor-pointer p-1"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21M4.22 19.78l1.59-1.59M17.66 6.34l1.59-1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
            </svg>
          )}
        </button>

        <Link 
          to="/checkout"
          className={`relative focus:outline-none transition-all duration-200 cursor-pointer p-1 ${currentPath === '/checkout' ? 'text-orange-600 opacity-100' : 'opacity-40 dark:opacity-50 hover:opacity-100 dark:text-stone-100 text-gray-900'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white dark:border-stone-900 transition-colors">
              {uniqueCartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    fetch('https://burgerspot-api.onrender.com/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-stone-950 text-black dark:text-stone-100 font-sans antialiased flex flex-col justify-between select-none transition-colors duration-300">
        
        <Navigation cart={cart} theme={theme} toggleTheme={toggleTheme} />

        <div className="h-16 md:h-24 w-full"></div>

        <main className="w-full px-4 md:px-8 py-6 flex-grow">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} products={products} />} />
            <Route path="/menu" element={<Menu products={products} cart={cart} addToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="py-8 text-center text-[9px] tracking-[0.2em] text-black dark:text-stone-500 opacity-30 uppercase font-medium transition-colors">
          <div className="w-full px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© 2026 BURGERSPOT. ПРОИЗВОДСТВЕННАЯ ПРАКТИКА.</p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;
