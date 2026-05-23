import React, { useState } from 'react';

export default function Checkout({ cart = [], setCart }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card_online');
  
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [orderError, setOrderError] = useState('');

  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const uniqueItems = [];
  const itemCounts = {};
  
  cart.forEach(item => {
    if (!itemCounts[item._id]) {
      itemCounts[item._id] = 0;
      uniqueItems.push(item);
    }
    itemCounts[item._id]++;
  });

  uniqueItems.sort((a, b) => a.name.localeCompare(b.name));

  const handleAddItem = (item) => {
    setCart([...cart, item]);
  };

  const handleRemoveItem = (item) => {
    if (itemCounts[item._id] <= 1) return;
    
    const index = cart.findIndex(i => i._id === item._id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const handleDeleteAll = (item) => {
    setCart(cart.filter(i => i._id !== item._id));
  };

  const handleApplyPromo = async () => {
    const codeToSend = promoInput.trim().toUpperCase();
    
    setPromoError('');
    setPromoSuccess('');
    
    if (!codeToSend) {
      setPromoError('Введите текст промокода');
      return;
    }

    try {
      const response = await fetch('https://burgerspot-api.onrender.com/api/promocode/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: codeToSend,
          orderSum: baseTotal 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setAppliedPromo({ 
          code: data.code, 
          type: data.type, 
          value: data.value 
        });

        const msg = data.type === 'percent' ? `${data.value}%` : `${data.value} ₽`;
        setPromoSuccess(`Промокод успешно применен! Скидка: ${msg}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setAppliedPromo(null);
        setPromoError(errorData.message || 'Неверный или неактивный промокод');
      }
    } catch (error) {
      console.error('Ошибка при проверке промокода:', error);
      setPromoError('Не удалось связаться с сервером');
    }
  };

  const baseTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const discountAmount = appliedPromo 
    ? (appliedPromo.type === 'percent' 
        ? (baseTotal * appliedPromo.value) / 100 
        : appliedPromo.value)
    : 0;

  const finalTotal = Math.max(0, baseTotal - discountAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');

    if (cart.length === 0) {
      setOrderError("Ваша корзина пуста!");
      return;
    }

    const orderData = {
      customer: {
        name,
        phone,
        address: deliveryMethod === 'delivery' ? address : 'Самовывоз (Ленина 15)',
        comment
      },
      items: uniqueItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: itemCounts[item._id]
      })),
      total: baseTotal,
      promocode: appliedPromo ? appliedPromo.code : null,
      discount: discountAmount,
      finalTotal,
      deliveryMethod,
      paymentMethod
    };

    try {
      const response = await fetch('https://burgerspot-api.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data._id || Math.floor(Math.random() * 10000));
        setIsOrdered(true);
        setCart([]);
      } else {
        setOrderError("Произошла ошибка на сервере при оформлении заказа.");
      }
    } catch (error) {
      console.error(error);
      setOrderError("Не удалось отправить заказ. Проверьте подключение к сети.");
    }
  };

  if (isOrdered) {
    return (
      <div className="w-full min-h-screen bg-amber-50/40 dark:bg-stone-950 p-4 md:p-8 flex items-center justify-center font-sans text-gray-900 dark:text-stone-100 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-md border border-gray-100 dark:border-stone-800 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-orange-950 dark:text-orange-500 mb-2">Спасибо!</h2>
          <p className="text-lg text-gray-800 dark:text-stone-200 font-bold mb-4">Ваш заказ №{orderId} принят</p>
          <p className="text-gray-500 dark:text-stone-400 mb-8">Мы свяжемся с вами в ближайшее время для подтверждения.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-colors w-full cursor-pointer"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-amber-50/40 dark:bg-stone-950 p-4 md:p-8 font-sans text-gray-900 dark:text-stone-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black mb-8 text-orange-950 dark:text-orange-500">Корзина</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-grow space-y-4">
            {cart.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-stone-800 shadow-sm text-gray-500 dark:text-stone-400">
                Здесь пока пусто. Загляните в меню, чтобы выбрать сочные бургеры.
              </div>
            ) : (
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-100 dark:border-stone-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-stone-800">
                {uniqueItems.map(item => (
                  <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                    
                    <div className="flex-grow text-center sm:text-left">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-stone-100 leading-tight">{item.name}</h4>
                      <p className="text-gray-500 dark:text-stone-400 text-sm mt-1">{item.price} ₽ / шт.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 dark:bg-stone-800 rounded-full border border-gray-200 dark:border-stone-700">
                        <button 
                          type="button"
                          disabled={itemCounts[item._id] <= 1}
                          onClick={() => handleRemoveItem(item)}
                          className={`w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors ${
                            itemCounts[item._id] <= 1 
                              ? 'text-gray-300 dark:text-stone-600 cursor-not-allowed' 
                              : 'text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 cursor-pointer'
                          }`}
                        >-</button>
                        <span className="w-8 text-center font-bold text-gray-900 dark:text-stone-100">{itemCounts[item._id]}</span>
                        <button 
                          type="button"
                          onClick={() => handleAddItem(item)}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-500 font-bold text-lg transition-colors cursor-pointer"
                        >+</button>
                      </div>
                      
                      <div className="w-24 text-right font-black text-lg text-gray-900 dark:text-stone-100">
                        {item.price * itemCounts[item._id]} ₽
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => handleDeleteAll(item)}
                        className="p-2 text-gray-400 dark:text-stone-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-[420px] flex-shrink-0">
            <div className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-stone-800 shadow-md">
              <h3 className="text-xl font-black text-orange-950 dark:text-orange-500 mb-6 border-b border-gray-100 dark:border-stone-800 pb-4">Оформление заказа</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5 uppercase tracking-wide">Имя</label>
                    <input 
                      type="text" required placeholder="Как к вам обращаться?" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-stone-900 transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5 uppercase tracking-wide">Телефон</label>
                    <input 
                      type="tel" required placeholder="+7 (999) 000-00-00" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-stone-900 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-stone-800">
                  <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-3 uppercase tracking-wide">Способ получения</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-colors cursor-pointer ${deliveryMethod === 'delivery' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-stone-700'}`}
                    >Доставка</button>
                    <button 
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-colors cursor-pointer ${deliveryMethod === 'pickup' ? 'bg-orange-600 text-white' : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-stone-700'}`}
                    >Самовывоз</button>
                  </div>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5 uppercase tracking-wide">Адрес</label>
                    <input 
                      type="text" required placeholder="Улица, дом, квартира" value={address} onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-stone-900 transition-colors text-sm"
                    />
                  </div>
                ) : (
                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl p-4 text-sm text-orange-800 dark:text-orange-400">
                    <span className="font-bold block mb-1">Ресторан для самовывоза:</span>
                    ул. Ленина, д. 15 (ежедневно с 10:00 до 23:00)
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-1.5 uppercase tracking-wide">Комментарий к заказу (необязательно)</label>
                  <textarea 
                    rows="2" placeholder="Домофон, подъезд или особые пожелания..." value={comment} onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-stone-900 transition-colors text-sm resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-stone-800">
                  <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-3 uppercase tracking-wide">Способ оплаты</label>
                  <select
                    value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-stone-900 text-sm cursor-pointer"
                  >
                    <option value="card_online">Онлайн картой</option>
                    <option value="cash">Наличными при получении</option>
                    <option value="card_courier">Картой при получении</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-stone-800">
                  <label className="block text-xs font-bold text-gray-500 dark:text-stone-400 mb-2 uppercase tracking-wide">Промокод</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Введите код" value={promoInput} onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-grow bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-stone-900 uppercase text-sm"
                    />
                    <button 
                      type="button" onClick={handleApplyPromo}
                      className="bg-stone-900 dark:bg-stone-700 hover:bg-stone-800 dark:hover:bg-stone-600 text-white font-bold py-2 px-6 rounded-xl text-sm transition-colors cursor-pointer"
                    >Применить</button>
                  </div>
                  
                  {promoError && (
                    <p className="text-red-500 dark:text-red-400 text-xs font-bold mt-2 pl-1 animate-fade-in">
                      {promoError}
                    </p>
                  )}
                  
                  {promoSuccess && (
                    <p className="text-green-600 dark:text-green-400 text-xs font-bold mt-2 pl-1 animate-fade-in">
                      {promoSuccess}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-stone-800 space-y-3">
                  <div className="flex justify-between text-gray-500 dark:text-stone-400 text-sm">
                    <span>Товары:</span>
                    <span className="font-bold text-gray-900 dark:text-stone-100">{baseTotal} ₽</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
                      <span>Скидка ({appliedPromo.type === 'percent' ? `${appliedPromo.value}%` : `${appliedPromo.value} ₽`}):</span>
                      <span className="font-bold">- {discountAmount} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 dark:text-stone-400 text-sm">
                    <span>Доставка:</span>
                    <span className="font-bold text-gray-900 dark:text-stone-100">{deliveryMethod === 'delivery' ? 'Бесплатно' : '—'}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-gray-100 dark:border-stone-800">
                    <span className="text-base font-bold text-gray-900 dark:text-stone-100">Итого:</span>
                    <span className="text-3xl font-black text-orange-600 dark:text-orange-500">{finalTotal} ₽</span>
                  </div>
                </div>

                {orderError && (
                  <p className="text-red-500 dark:text-red-400 text-sm font-bold text-center bg-red-50 dark:bg-red-950/20 py-2 rounded-xl border border-red-100 dark:border-red-900/30">
                    {orderError}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={cart.length === 0}
                  className={`w-full font-black py-4 rounded-xl text-lg transition-all duration-200 ${
                    cart.length === 0 
                      ? 'bg-gray-200 dark:bg-stone-800 text-gray-400 dark:text-stone-600 cursor-not-allowed' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-orange-500/20 active:scale-95 cursor-pointer'
                  }`}
                >
                  Отправить заказ
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
