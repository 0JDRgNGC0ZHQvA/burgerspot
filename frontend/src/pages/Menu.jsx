import React, { useState } from 'react';

const CATEGORY_MAP = [
  { id: 'BURGER', title: 'Бургеры' },
  { id: 'FRIES', title: 'Картошка фри' },
  { id: 'DRINK', title: 'Напитки' },
  { id: 'SAUCE', title: 'Соусы' },
  { id: 'DESSERT', title: 'Десерты' },
  { id: 'COMBO', title: 'Комбо-обеды' },
  { id: 'SNACK', title: 'Закуски' }
];

export default function Menu({ products = [], addToCart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('default');
  const [visibleCounts, setVisibleCounts] = useState({});

  let filteredProducts = products.filter(product =>
    product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortType === 'popularity') {
    filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  } else if (sortType === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const handleShowMore = (categoryId) => {
    setVisibleCounts(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 8) + 8
    }));
  };

  return (
    <div className="w-full min-h-screen bg-amber-50/40 dark:bg-stone-950 p-4 md:p-8 font-sans text-gray-900 dark:text-stone-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-black mb-6 text-orange-950 dark:text-stone-100">Меню</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Поиск блюда..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 dark:border-stone-800 rounded-xl p-3 flex-grow bg-white dark:bg-stone-900 shadow-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-base text-gray-900 dark:text-stone-100 transition-colors"
          />
          
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 dark:border-stone-800 rounded-xl p-3 bg-white dark:bg-stone-900 shadow-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-base text-gray-900 dark:text-stone-100 cursor-pointer transition-colors"
          >
            <option value="default">По умолчанию</option>
            <option value="popularity">Сначала популярные</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
          </select>
        </div>

        {CATEGORY_MAP.map(categoryInfo => {
          const categoryProducts = filteredProducts.filter(
            p => p.category && p.category.toLowerCase() === categoryInfo.id.toLowerCase()
          );

          if (categoryProducts.length === 0) return null;

          const currentVisibleCount = visibleCounts[categoryInfo.id] || 8;
          const visibleProducts = categoryProducts.slice(0, currentVisibleCount);
          const hasMore = categoryProducts.length > currentVisibleCount;

          return (
            <div key={categoryInfo.id} className="mb-12">
              <h2 className="text-2xl font-extrabold mb-6 text-orange-950 dark:text-stone-100 border-b border-gray-200 dark:border-stone-800 pb-2">
                {categoryInfo.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {visibleProducts.map(product => (
                  <div 
                    key={product._id} 
                    className="bg-white dark:bg-stone-900 rounded-2xl p-4 flex flex-col justify-between border border-gray-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    
                    <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-gray-50/50 dark:bg-stone-950/40">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100 mb-1 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-stone-400 overflow-hidden h-10 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-stone-800/60">
                      <span className="text-xl font-black text-gray-900 dark:text-stone-100">
                        {product.price} ₽
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors active:scale-95 transform"
                      >
                        Заказать
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => handleShowMore(categoryInfo.id)}
                    className="bg-orange-950 hover:bg-orange-900 dark:bg-stone-800 dark:hover:bg-stone-700 text-white dark:text-stone-100 font-bold py-2.5 px-8 rounded-full text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    Показать ещё
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-stone-400 mt-16 text-lg">
            К сожалению, по вашему запросу ничего не найдено.
          </div>
        )}
      </div>
    </div>
  );
}
