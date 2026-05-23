import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ products = [], addToCart }) {
  // Инициализируем хук навигации
  const navigate = useNavigate();

  const popularBurgers = products
    .filter(p => p.category && p.category.toLowerCase() === 'burger')
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-amber-50/40 dark:bg-stone-950 font-sans text-gray-900 dark:text-stone-100 transition-colors duration-300">
      
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-orange-950 dark:text-stone-100 leading-none mb-6">
            Сочные бургеры <br />
            <span className="text-orange-600">твоей мечты</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-stone-400 mb-8 max-w-md mx-auto md:mx-0">
            Готовим из 100% говядины на открытом огне. Хрустящая булочка бриошь и фирменный соус в каждом бургере.
          </p>
          <button
            // Меняем setPage на navigate
            onClick={() => navigate('/menu')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-black py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-orange-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            В меню
          </button>
        </div>
        <div className="flex-1 w-full max-w-md md:max-w-none flex justify-center">
          <img
            src={popularBurgers[0]?.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"}
            alt="Фирменный бургер"
            className="w-full max-h-[400px] object-contain drop-shadow-2xl animate-bounce-slow"
          />
        </div>
      </section>

      <section className="bg-white dark:bg-stone-900 border-y border-gray-100 dark:border-stone-800 py-12 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-orange-950 dark:text-stone-100 mb-8 text-center md:text-left">
            Горячие акции недели
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-center min-h-[180px] shadow-md">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wider uppercase w-max">
                Скидка дня
              </span>
              <h3 className="text-2xl font-black mt-3 mb-1">Скидка 20% по промокоду</h3>
              <p className="text-white/90 text-sm max-w-sm">
                Введи промокод <strong className="underline">BURGER20</strong> при оформлении заказа в корзине. Действует на всё меню.
              </p>
            </div>

            <div className="bg-gradient-to-r from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-700 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-center min-h-[180px] shadow-md">
              <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wider uppercase w-max">
                Комбо-обед
              </span>
              <h3 className="text-2xl font-black mt-3 mb-1">Комбо Перекус по-деревенски</h3>
              <p className="text-stone-300 text-sm max-w-sm">
                Чизбургер, картофель по-деревенски и кетчуп. Идеальный обед для одного всего за 499 ₽.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-black text-orange-950 dark:text-stone-100">Популярно в этом месяце</h2>
            <p className="text-gray-500 dark:text-stone-400 text-sm mt-1">Хиты продаж, которые заказывают чаще всего</p>
          </div>
          <button 
            // Меняем setPage на navigate
            onClick={() => navigate('/menu')}
            className="text-orange-600 hover:text-orange-700 font-bold text-sm border-b-2 border-orange-600/20 hover:border-orange-700 transition-all cursor-pointer"
          >
            Смотреть все бургеры
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {popularBurgers.length > 0 ? (
            popularBurgers.map(product => (
              <div 
                key={product._id} 
                className="bg-white dark:bg-stone-900 rounded-2xl p-4 flex flex-col justify-between border border-gray-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-full h-40 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-gray-50/50 dark:bg-stone-950/40">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-grow flex flex-col mb-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-stone-100 mb-1 leading-tight">{product.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-stone-400 overflow-hidden h-8 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-stone-800/60">
                  <span className="text-lg font-black text-gray-900 dark:text-stone-100">{product.price} ₽</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1.5 px-4 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Заказать
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-gray-400 dark:text-stone-500 text-sm">
              Загружаем популярные товары...
            </div>
          )}
        </div>
      </section>

      <section className="bg-stone-900 dark:bg-stone-900/60 text-stone-100 py-16 border-b border-stone-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-12 text-center">
            Почему выбирают BurgerSpot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-600/10 text-orange-500 rounded-full flex items-center justify-center mb-4 border border-orange-600/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Быстрая доставка</h3>
              <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                Привезем ваш заказ горячим в течение 30-45 минут. Собственная курьерская служба в термосумках.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-600/10 text-orange-500 rounded-full flex items-center justify-center mb-4 border border-orange-600/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Удобная оплата</h3>
              <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                Платите онлайн на сайте, картой курьеру или наличными при получении. Всё для вашего комфорта.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-600/10 text-orange-500 rounded-full flex items-center justify-center mb-4 border border-orange-600/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Качество огня</h3>
              <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                Никакой заморозки. Котлеты формируются вручную каждое утро и жарятся только после вашего заказа.
              </p>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-400 py-12 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-stone-900 pb-8 mb-8">
          <div className="text-center md:text-left">
            <span className="text-white font-black text-xl tracking-wider uppercase">
              Burger<span className="text-orange-600">Spot</span>
            </span>
            <p className="text-xs text-stone-500 mt-1">© 2026 Все права защищены.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-stone-300 font-medium">
            {/* Меняем onNavigate на navigate */}
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer">Главная</button>
            <button onClick={() => navigate('/menu')} className="hover:text-white transition-colors cursor-pointer">Меню</button>
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors cursor-pointer">О ресторане</button>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white font-bold">Режим работы:</p>
            <p className="text-xs text-stone-400 mt-0.5">Пн–Вс: 10:00 – 23:00</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-600">
          <p>Создано для ПП</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://vk.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-stone-500 hover:text-orange-600 transition-colors duration-200"
              aria-label="Мы ВКонтакте"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.013 3h-6.026C5.034 3 3 5.034 3 8.987v6.026C3 18.966 5.034 21 8.987 21h6.026C18.966 21 21 18.966 21 15.013V8.987C21 5.034 18.966 3 15.013 3zm2.593 11.455c.168.423-.131.785-.563.785h-1.85c-.443 0-.752-.257-.9-.572-.515-1.1-1.39-2.2-1.751-2.2-.258 0-.361.114-.361.428v1.64c0 .543-.206.704-.67.704-2.268 0-4.587-2.314-5.309-5.485-.093-.428.1-.657.543-.657h1.851c.361 0 .618.171.721.485.464 1.343 1.289 2.514 1.547 2.514.154 0 .257-.085.257-.428v-1.914c-.051-1.057-.618-1.114-.618-1.486 0-.171.144-.343.361-.343h2.938c.31 0 .464.143.464.514v2.571c0 .286.103.371.18.371.155 0 .31-.085.619-.371.98-1.229 1.443-2.6 1.443-2.6.077-.286.31-.429.67-.429h1.85c.49 0 .644.229.49.657-.232.743-1.624 3.029-1.624 3.029-.232.343-.31.543 0 .914.025.057 1.391 1.914 1.7 2.4z"/>
              </svg>
            </a>

            <a 
              href="https://t.me" 
              target="_blank" 
              rel="noreferrer"
              className="text-stone-500 hover:text-orange-600 transition-colors duration-200"
              aria-label="Наш Telegram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
