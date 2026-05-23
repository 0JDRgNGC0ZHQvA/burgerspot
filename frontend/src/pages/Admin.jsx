import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [isDeleteOrderModalOpen, setIsDeleteOrderModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'burger',
    price: '',
    description: '',
    image: '',
    weight: ''
  });

  const [promocodes, setPromocodes] = useState([]);
  const [promocodesLoading, setPromocodesLoading] = useState(false);
  const [promocodesError, setPromocodesError] = useState(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    type: 'percent',
    value: '',
    minOrderSum: '',
    expiresAt: ''
  });

  useEffect(() => {
    const sessionAuth = localStorage.getItem('adminAuthorized');
    if (sessionAuth === 'true') {
      setIsAuthorized(true);
      fetchOrders();
      fetchProducts();
      fetchPromocodes();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(null);
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuthorized', 'true');
      setIsAuthorized(true);
      fetchOrders();
      fetchProducts();
      fetchPromocodes();
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthorized');
    setIsAuthorized(false);
    setOrders([]);
    setProducts([]);
    setPromocodes([]);
  };

  const fetchOrders = () => {
    setOrdersLoading(true);
    setOrdersError(null);
    fetch('http://localhost:5000/api/admin/orders')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при загрузке заказов');
        return res.json();
      })
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setOrdersLoading(false);
      })
      .catch(err => {
        setOrdersError(err.message);
        setOrdersLoading(false);
      });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Ошибка при изменении статуса');
    }
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderToDelete._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setOrders(prev => prev.filter(o => o._id !== orderToDelete._id));
        setIsDeleteOrderModalOpen(false);
      }
    } catch (err) {
      alert('Ошибка при удалении заказа');
    }
  };

  const fetchProducts = () => {
    setProductsLoading(true);
    setProductsError(null);
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при загрузке меню');
        return res.json();
      })
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setProductsLoading(false);
      })
      .catch(err => {
        setProductsError(err.message);
        setProductsLoading(false);
      });
  };

  const openAddProductModal = () => {
    setEditingProductId(null);
    setProductForm({ name: '', category: 'burger', price: '', description: '', image: '', weight: '' });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name || '',
      category: product.category || 'burger',
      price: product.price || '',
      description: product.description || '',
      image: product.image || '',
      weight: product.weight || ''
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = editingProductId 
      ? `http://localhost:5000/api/admin/products/${editingProductId}`
      : 'http://localhost:5000/api/admin/products';
    const method = editingProductId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        alert('Не удалось сохранить изменения');
      }
    } catch (err) {
      alert('Ошибка сети при сохранении товара');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это блюдо из меню?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId));
      }
    } catch (err) {
      alert('Ошибка при удалении товара');
    }
  };

  const fetchPromocodes = () => {
    setPromocodesLoading(true);
    setPromocodesError(null);
    fetch('http://localhost:5000/api/admin/promocodes')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при загрузке промокодов');
        return res.json();
      })
      .then(data => {
        setPromocodes(Array.isArray(data) ? data : []);
        setPromocodesLoading(false);
      })
      .catch(err => {
        setPromocodesError(err.message);
        setPromocodesLoading(false);
      });
  };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/promocodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...promoForm,
          code: promoForm.code.toUpperCase(),
          value: Number(promoForm.value),
          minOrderSum: Number(promoForm.minOrderSum) || 0
        }),
      });

      if (response.ok) {
        setIsPromoModalOpen(false);
        fetchPromocodes();
      } else {
        alert('Не удалось сохранить промокод');
      }
    } catch (err) {
      alert('Ошибка сети при сохранении промокода');
    }
  };

  const handleDeletePromo = async (code) => {
    if (!window.confirm(`Вы уверены, что хотите удалить промокод ${code}?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/promocodes/${code}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setPromocodes(prev => prev.filter(p => p.code !== code));
      }
    } catch (err) {
      alert('Ошибка при удалении промокода');
    }
  };

  const translateStatus = (status) => {
    const map = { new: 'Новый', cooking: 'Готовится', delivery: 'В доставке', completed: 'Выполнен', cancelled: 'Отменён' };
    return map[status] || status;
  };

  const translateCategory = (cat) => {
    const map = { burger: 'Бургеры', fries: 'Картошка фри', drinks: 'Напитки', sauces: 'Соусы', desserts: 'Десерты', combo: 'Комбо-обеды' };
    return map[cat] || cat;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';
      case 'cooking': return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40';
      case 'delivery': return 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40';
      case 'completed': return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40';
      case 'cancelled': return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40';
      default: return 'bg-gray-50 dark:bg-stone-800 text-gray-700 dark:text-stone-300 border-gray-200 dark:border-stone-700';
    }
  };

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.finalTotal || o.total || 0), 0);

  if (!isAuthorized) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center font-sans text-gray-900 dark:text-stone-100 bg-white dark:bg-stone-950 p-4 transition-colors duration-300">
        <div className="max-w-md w-full border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-wider text-gray-900 dark:text-stone-100">Вход в <span className="text-orange-600">Панель</span></h2>
            <p className="text-gray-400 dark:text-stone-500 text-xs mt-1 font-medium">Только для авторизованных сотрудников</p>
          </div>
          {loginError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold text-center">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
            <div className="space-y-1.5">
              <label className="text-gray-400 dark:text-stone-500 uppercase tracking-wider">Логин</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 font-medium text-sm text-gray-900 dark:text-stone-100 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-400 dark:text-stone-500 uppercase tracking-wider">Пароль</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 font-medium text-sm text-gray-900 dark:text-stone-100 transition-colors" />
            </div>
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3.5 rounded-xl uppercase tracking-widest block w-full transition-all cursor-pointer shadow-md shadow-orange-100 dark:shadow-none">Войти в систему</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-amber-50/40 dark:bg-stone-950 p-4 md:p-8 font-sans text-gray-900 dark:text-stone-100 rounded-3xl transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-orange-950 dark:text-stone-100">Панель управления</h1>
            <div className="flex gap-4 mt-3">
              <button onClick={() => setActiveTab('orders')} className={`text-sm font-bold pb-1 uppercase tracking-wider transition-colors ${activeTab === 'orders' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 dark:text-stone-500 hover:text-gray-600 dark:hover:text-stone-300'}`}>Заказы ({orders.length})</button>
              <button onClick={() => setActiveTab('menu')} className={`text-sm font-bold pb-1 uppercase tracking-wider transition-colors ${activeTab === 'menu' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 dark:text-stone-500 hover:text-gray-600 dark:hover:text-stone-300'}`}>Меню ({products.length})</button>
              <button onClick={() => setActiveTab('promocodes')} className={`text-sm font-bold pb-1 uppercase tracking-wider transition-colors ${activeTab === 'promocodes' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 dark:text-stone-500 hover:text-gray-600 dark:hover:text-stone-300'}`}>Промокоды ({promocodes.length})</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-stone-900 px-6 py-2.5 rounded-2xl shadow-sm border border-orange-100 dark:border-stone-800 flex flex-col justify-center transition-colors">
                <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-stone-500 tracking-wider">Выручка (выполнено)</span>
                <span className="text-lg font-black text-orange-600 dark:text-orange-500">{totalRevenue} ₽</span>
              </div>
            )}
            <button 
              onClick={() => {
                if (activeTab === 'orders') fetchOrders();
                else if (activeTab === 'menu') fetchProducts();
                else fetchPromocodes();
              }} 
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-2xl transition-all text-xs uppercase tracking-wider cursor-pointer"
            >
              Обновить
            </button>
            <button onClick={handleLogout} className="bg-gray-200 dark:bg-stone-800 hover:bg-gray-300 dark:hover:bg-stone-700 text-gray-700 dark:text-stone-300 font-bold px-4 py-2.5 rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider">Выйти</button>
          </div>
        </div>

        {activeTab === 'orders' && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
              {['all', 'new', 'cooking', 'delivery', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    orderFilter === status ? 'bg-orange-950 dark:bg-stone-800 text-white dark:text-stone-100' : 'bg-white dark:bg-stone-900 text-gray-500 dark:text-stone-400 border border-gray-100 dark:border-stone-800 hover:border-orange-200 dark:hover:border-stone-700'
                  }`}
                >
                  {status === 'all' ? 'Все заказы' : translateStatus(status)}
                </button>
              ))}
            </div>

            {ordersError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">Ошибка: {ordersError}</div>}
            {ordersLoading ? (
              <div className="text-center py-20 text-gray-400 dark:text-stone-500 font-bold">Загрузка информации о заказах...</div>
            ) : orders.filter(o => orderFilter === 'all' ? true : o.status === orderFilter).length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-stone-800 shadow-sm transition-colors"><p className="text-gray-400 dark:text-stone-500 font-medium">Нет заказов в этой категории</p></div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders
                  .filter(o => orderFilter === 'all' ? true : o.status === orderFilter)
                  .map((order, idx) => (
                    <div key={order._id || idx} className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 overflow-hidden transition-colors">
                      <div className="p-5 border-b border-gray-50 dark:border-stone-800/80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/40 dark:bg-stone-950/40">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-orange-950 dark:bg-stone-800 text-white dark:text-stone-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Заказ #{orders.length - idx}</span>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider transition-colors ${getStatusStyle(order.status)}`}>{translateStatus(order.status || 'new')}</span>
                          <span className="text-xs text-gray-400 dark:text-stone-500 font-medium">ID: {order._id?.slice(-6)}</span>
                        </div>
                        <div className="text-right flex lg:block justify-between w-full lg:w-auto items-center">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-stone-500 uppercase tracking-tighter block lg:inline mr-2 lg:mr-0">Итого:</span>
                          <span className="text-xl font-black text-orange-600 dark:text-orange-500">{order.finalTotal || order.total || 0} ₽</span>
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <h4 className="text-[9px] font-black text-gray-400 dark:text-stone-500 uppercase tracking-widest mb-2">Доставка</h4>
                          <div className="text-xs space-y-1">
                            <p className="font-bold text-gray-900 dark:text-stone-100 text-sm">{order.customer?.name || 'Гость'}</p>
                            <p className="text-orange-600 dark:text-orange-500 font-semibold">{order.customer?.phone || '—'}</p>
                            <p className="text-gray-500 dark:text-stone-400 font-medium">{order.customer?.address || 'Самовывоз'}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[9px] font-black text-gray-400 dark:text-stone-500 uppercase tracking-widest mb-2">Корзина</h4>
                          <div className="space-y-1 max-h-24 overflow-y-auto text-xs font-medium dark:scrollbar-none">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex justify-between text-gray-700 dark:text-stone-300">
                                <span>{item.name}</span>
                                <span className="text-gray-400 dark:text-stone-500 text-[11px] font-bold">{item.quantity} шт × {item.price}₽</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="text-[9px] font-black text-gray-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Статус</h4>
                            <select value={order.status || 'new'} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-gray-900 dark:text-stone-100 transition-colors">
                              <option value="new">Новый</option>
                              <option value="cooking">Готовится</option>
                              <option value="delivery">В доставке</option>
                              <option value="completed">Выполнен</option>
                              <option value="cancelled">Отменён</option>
                            </select>
                          </div>
                          <button onClick={() => { setOrderToDelete(order); setIsDeleteOrderModalOpen(true); }} className="text-red-400 dark:text-red-500/80 hover:text-red-600 dark:hover:text-red-400 text-[10px] font-black uppercase tracking-widest text-left cursor-pointer transition-colors">Удалить заказ</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'menu' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-orange-950 dark:text-stone-100 uppercase tracking-wider">Каталог блюд ресторана</h3>
              <button onClick={openAddProductModal} className="bg-orange-950 dark:bg-stone-800 hover:bg-orange-900 dark:hover:bg-stone-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm">Добавить блюдо</button>
            </div>

            {productsError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">Ошибка: {productsError}</div>}
            {productsLoading ? (
              <div className="text-center py-20 text-gray-400 dark:text-stone-500 font-bold">Синхронизация меню...</div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-stone-800 shadow-sm transition-colors"><p className="text-gray-400 dark:text-stone-500 font-medium">Menu пустое. Добавьте первый товар!</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800/80 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <div>
                      {product.image && <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-2xl mb-4 bg-gray-50 dark:bg-stone-950" onError={(e) => { e.target.src='https://placehold.co/300x200?text=BurgerSpot'; }} />}
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-black text-gray-900 dark:text-stone-100 text-base leading-tight">{product.name}</h4>
                        <span className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-black px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition-colors">{product.price} ₽</span>
                      </div>
                      <div className="flex gap-2 text-[10px] font-bold text-gray-400 dark:text-stone-500 uppercase tracking-wider mb-3">
                        <span>{translateCategory(product.category)}</span>
                        {product.weight && <span>• {product.weight} г</span>}
                      </div>
                      <p className="text-gray-500 dark:text-stone-400 text-xs font-medium leading-relaxed mb-4 line-clamp-3">{product.description || 'Описание отсутствует.'}</p>
                    </div>
                    <div className="flex gap-2 border-t border-gray-50 dark:border-stone-800/60 pt-3">
                      <button onClick={() => openEditProductModal(product)} className="flex-1 bg-gray-50 dark:bg-stone-950 hover:bg-gray-100 dark:hover:bg-stone-800 text-gray-700 dark:text-stone-300 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer text-center">Редактировать</button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="px-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors cursor-pointer flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'promocodes' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-orange-950 dark:text-stone-100 uppercase tracking-wider">Управление промокодами</h3>
              <button 
                onClick={() => {
                  setPromoForm({ code: '', type: 'percent', value: '', minOrderSum: '', expiresAt: '' });
                  setIsPromoModalOpen(true);
                }} 
                className="bg-orange-950 dark:bg-stone-800 hover:bg-orange-900 dark:hover:bg-stone-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Создать промокод
              </button>
            </div>

            {promocodesError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">Ошибка: {promocodesError}</div>}
            {promocodesLoading ? (
              <div className="text-center py-20 text-gray-400 dark:text-stone-500 font-bold">Синхронизация промокодов...</div>
            ) : promocodes.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-stone-800 shadow-sm transition-colors">
                <p className="text-gray-400 dark:text-stone-500 font-medium">Промокоды отсутствуют. Создайте первый промокод!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promocodes.map((promo) => (
                  <div key={promo.code} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-dashed border-orange-200 dark:border-stone-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-black text-xl text-orange-600 dark:text-orange-500 tracking-widest uppercase bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-xl transition-colors">
                          {promo.code}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 dark:text-stone-500 uppercase tracking-wider bg-gray-50 dark:bg-stone-950 px-2.5 py-1 rounded-lg transition-colors">
                          {promo.type === 'percent' ? 'Процент' : 'Фикс'}
                        </span>
                      </div>
                      <div className="space-y-2 text-xs font-medium text-gray-600 dark:text-stone-400">
                        <p>Размер скидки: <span className="font-bold text-gray-950 dark:text-stone-100">{promo.value} {promo.type === 'percent' ? '%' : '₽'}</span></p>
                        <p>Мин. заказ: <span className="font-bold text-gray-950 dark:text-stone-100">{promo.minOrderSum || 0} ₽</span></p>
                        {promo.expiresAt && <p>Действует до: <span className="font-bold text-gray-950 dark:text-stone-100">{new Date(promo.expiresAt).toLocaleDateString('ru-RU')}</span></p>}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeletePromo(promo.code)} 
                      className="mt-5 w-full bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer text-center uppercase tracking-wider"
                    >
                      Удалить промокод
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/40 dark:bg-stone-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-stone-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-orange-100 dark:border-stone-800 max-h-[90vh] overflow-y-auto transition-colors">
            <h3 className="text-xl font-black text-orange-950 dark:text-stone-100 mb-4 uppercase tracking-wider">{editingProductId ? 'Изменение блюда' : 'Новая позиция в меню'}</h3>
            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-stone-500 uppercase">Название блюда *</label>
                <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-sm text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-stone-500 uppercase">Категория *</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors">
                    <option value="burger">Бургеры</option>
                    <option value="fries">Картошка фри</option>
                    <option value="drinks">Напитки</option>
                    <option value="sauces">Соусы</option>
                    <option value="desserts">Десерты</option>
                    <option value="combo">Комбо-обеды</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-stone-500 uppercase">Цена (руб) *</label>
                  <input type="number" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-sm text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-stone-500 uppercase">Вес блюда (грамм)</label>
                <input type="number" value={productForm.weight} onChange={(e) => setProductForm({...productForm, weight: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-sm text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-stone-500 uppercase">Ссылка на изображение</label>
                <input type="text" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-xs text-gray-600 dark:text-stone-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-stone-500 uppercase">Состав / Описание</label>
                <textarea rows="3" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-xs leading-relaxed text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-600 dark:text-stone-300 py-3 rounded-xl uppercase transition-colors cursor-pointer">Отмена</button>
                <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl uppercase transition-colors cursor-pointer shadow-md dark:shadow-none">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/40 dark:bg-stone-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-stone-900 max-w-sm w-full rounded-3xl p-6 shadow-2xl text-center border border-orange-100 dark:border-stone-800 transition-colors">
            <h3 className="text-lg font-black text-orange-950 dark:text-stone-100 mb-2">Удаление записи</h3>
            <p className="text-gray-500 dark:text-stone-400 text-xs mb-6 font-medium">Вы уверены, что хотите безвозвратно удалить информацию о заказе?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOrderModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-600 dark:text-stone-300 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors">Отмена</button>
              <button onClick={confirmDeleteOrder} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-md dark:shadow-none transition-colors">Удалить</button>
            </div>
          </div>
        </div>
      )}

      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-950/40 dark:bg-stone-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-stone-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-orange-100 dark:border-stone-800 transition-colors">
            <h3 className="text-xl font-black text-orange-950 dark:text-stone-100 mb-4 uppercase tracking-wider">Новый промокод</h3>
            <form onSubmit={handlePromoSubmit} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-stone-500 uppercase">Промокод *</label>
                <input type="text" required value={promoForm.code} onChange={(e) => setPromoForm({...promoForm, code: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-sm text-gray-900 dark:text-stone-100 uppercase tracking-widest focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-stone-500 uppercase">Тип скидки *</label>
                  <select value={promoForm.type} onChange={(e) => setPromoForm({...promoForm, type: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors">
                    <option value="percent">Процент (%)</option>
                    <option value="fixed">Фиксированная (₽)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 dark:text-stone-500 uppercase">Размер скидки *</label>
                  <input type="number" required value={promoForm.value} onChange={(e) => setPromoForm({...promoForm, value: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-sm text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-stone-500 uppercase">Минимальная сумма заказа (₽)</label>
                <input type="number" value={promoForm.minOrderSum} onChange={(e) => setPromoForm({...promoForm, minOrderSum: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-sm text-gray-900 dark:text-stone-100 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 dark:text-stone-500 uppercase">Срок действия</label>
                <input type="date" value={promoForm.expiresAt} onChange={(e) => setPromoForm({...promoForm, expiresAt: e.target.value})} className="w-full bg-gray-50 dark:bg-stone-950 border border-gray-100 dark:border-stone-800 rounded-xl px-3 py-2.5 font-medium text-sm text-gray-500 dark:text-stone-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsPromoModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-600 dark:text-stone-300 py-3 rounded-xl uppercase transition-colors cursor-pointer">Отмена</button>
                <button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl uppercase transition-colors cursor-pointer shadow-md dark:shadow-none">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
