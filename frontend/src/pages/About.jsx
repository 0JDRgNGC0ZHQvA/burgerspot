import React, { useState } from 'react';

export default function About() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const setPageFormData = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('=== Обратная связь BurgerSpot ===');
    console.log('Имя:', formData.name);
    console.log('Email:', formData.email);
    console.log('Сообщение:', formData.message);
    
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-4 font-sans text-gray-900 dark:text-stone-100 bg-white dark:bg-stone-950 transition-colors duration-300">
      
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="text-orange-600 font-black text-xs uppercase tracking-widest block">Наша концепция</span>
          <h1 className="text-4xl font-black text-gray-900 dark:text-stone-100 tracking-tight leading-none uppercase">
            О ресторане <span className="text-orange-600">BurgerSpot</span>
          </h1>
          <p className="text-gray-600 dark:text-stone-400 leading-relaxed text-sm font-medium">
            Основанный в 2026 году, BurgerSpot — это не просто очередная бургерная, а гастрономическое пространство с акцентом на исключительное качество. Наш шеф-повар лично отбирает мраморную говядину зернового откорма и контролирует выпекание фирменных картофельных булочек каждое утро.
          </p>
          <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-stone-400">
            <div>
              <p className="text-gray-400 dark:text-stone-500 text-[10px] mb-1">Время работы</p>
              <p className="text-gray-900 dark:text-stone-100 font-extrabold">Пн–Вс 10:00 – 23:00</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-stone-500 text-[10px] mb-1">Телефон для брони</p>
              <p className="text-orange-600 font-extrabold">+7 (999) 123-45-67</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-72">
          <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-stone-800">
            <img 
              src="https://img.magnific.com/free-photo/restaurant-interior_1127-3393.jpg" 
              alt="Зал"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-stone-800 grid grid-rows-2 gap-4">
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="https://img.magnific.com/free-photo/sooking-burgers-kitchen-home-quarantine-time_627829-7070.jpg" 
                alt="Кухня"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="https://img.magnific.com/free-photo/front-view-man-arranging-cookies-display_23-2148366703.jpg" 
                alt="Ингредиенты"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 dark:text-stone-500 uppercase tracking-widest">Мы на карте</h3>
        <div className="w-full h-64 bg-gray-100 dark:bg-stone-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-stone-800 relative shadow-sm flex items-center justify-center">
          <iframe 
            title="BurgerSpot Map"
            src="https://yandex.ru/map-widget/v1/?ll=76.530893%2C60.935203&z=17.8"
            className="w-full h-full border-0 grayscale opacity-90 dark:opacity-80 transition-opacity"
            allowFullScreen={true}
          ></iframe>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4 border-t border-gray-100 dark:border-stone-800">
        <div className="md:col-span-1 space-y-3 text-sm">
          <h3 className="text-xl font-black text-gray-900 dark:text-stone-100 uppercase tracking-wide">Контакты</h3>
          <p className="text-gray-500 dark:text-stone-400 font-medium">По вопросам сотрудничества, предложений или жалоб свяжитесь с нашей администрации.</p>
          <div className="pt-2 text-xs font-bold text-gray-700 dark:text-stone-300 space-y-1">
            <p><span className="text-gray-400 dark:text-stone-500 font-medium">Адрес:</span> ул. Ленина, д. 15</p>
            <p><span className="text-gray-400 dark:text-stone-500 font-medium">Email:</span> info@burgerspot.ru</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-gray-50/50 dark:bg-stone-900/40 border border-gray-100 dark:border-stone-800/80 p-8 rounded-3xl">
          <h4 className="text-sm font-black text-gray-800 dark:text-stone-200 uppercase tracking-wider mb-6">Форма обратной связи</h4>
          
          {submitted ? (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 rounded-2xl text-xs font-bold uppercase tracking-wider text-center animate-pulse">
              Сообщение успешно отправлено! Спасибо за обратную связь.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 dark:text-stone-500 uppercase tracking-wider">Ваше имя</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setPageFormData('name', e.target.value)}
                    className="w-full bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 font-medium text-sm text-gray-900 dark:text-stone-100 transition-colors"
                    placeholder="Александр"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 dark:text-stone-500 uppercase tracking-wider">Ваш Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setPageFormData('email', e.target.value)}
                    className="w-full bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 font-medium text-sm text-gray-900 dark:text-stone-100 transition-colors"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 dark:text-stone-500 uppercase tracking-wider">Сообщение</label>
                <textarea 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={(e) => setPageFormData('message', e.target.value)}
                  className="w-full bg-white dark:bg-stone-950 border border-gray-200 dark:border-stone-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 font-medium text-sm text-gray-900 dark:text-stone-100 transition-colors resize-none"
                  placeholder="Текст вашего обращения..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3.5 rounded-xl uppercase tracking-widest transition-colors cursor-pointer text-center block w-full sm:w-auto"
              >
                Отправить сообщение
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
