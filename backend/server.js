const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.error(err));


const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const PROMOCODES_FILE = path.join(__dirname, 'promocodes.json');

const readData = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/', (req, res) => {
    res.send('Локальный сервер BurgerSpot работает');
});

app.get('/api/products', (req, res) => {
    let products = readData(PRODUCTS_FILE);
    const { category, search } = req.query;

    if (category) {
        products = products.filter(p => p.category === category);
    }
    if (search) {
        products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const product = products.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });
    res.json(product);
});

app.post('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const newOrder = {
        _id: '_' + Math.random().toString(36).substr(2, 9), // Генерируем простой ID
        ...req.body,
        status: 'new',
        createdAt: new Date()
    };
    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);
    // Изменено: возвращаем поле _id в ответе, чтобы фронтенд вывел правильный номер заказа
    res.status(201).json({ message: 'Заказ успешно создан', _id: newOrder._id });
});

app.get('/api/admin/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    res.json(orders);
});

app.patch('/api/admin/orders/:id', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o._id === req.params.id);
    
    if (orderIndex === -1) return res.status(404).json({ message: 'Заказ не найден' });
    
    orders[orderIndex].status = req.body.status;
    writeData(ORDERS_FILE, orders);
    res.json({ message: 'Статус заказа обновлен', order: orders[orderIndex] });
});

app.delete('/api/admin/orders/:id', (req, res) => {
    let orders = readData(ORDERS_FILE);
    const orderExists = orders.some(o => o._id === req.params.id);
    
    if (!orderExists) return res.status(404).json({ message: 'Заказ не найден' });
    
    orders = orders.filter(o => o._id !== req.params.id);
    writeData(ORDERS_FILE, orders);
    res.json({ message: 'Заказ успешно удален из архива' });
});

app.post('/api/admin/products', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const newProduct = {
        _id: '_' + Math.random().toString(36).substr(2, 9), // Генерируем ID
        ...req.body,
        price: Number(req.body.price), // Гарантируем, что цена будет числом
        popularity: 0,
        isAvailable: true
    };
    products.push(newProduct);
    writeData(PRODUCTS_FILE, products);
    res.status(201).json({ message: 'Товар успешно добавлен', product: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const index = products.findIndex(p => p._id === req.params.id);
    
    if (index === -1) return res.status(404).json({ message: 'Товар не найден' });
    
    products[index] = {
        ...products[index],
        ...req.body,
        price: Number(req.body.price)
    };
    
    writeData(PRODUCTS_FILE, products);
    res.json({ message: 'Товар успешно обновлен', product: products[index] });
});

app.delete('/api/admin/products/:id', (req, res) => {
    let products = readData(PRODUCTS_FILE);
    const exists = products.some(p => p._id === req.params.id);
    
    if (!exists) return res.status(404).json({ message: 'Товар не найден' });
    
    products = products.filter(p => p._id !== req.params.id);
    writeData(PRODUCTS_FILE, products);
    res.json({ message: 'Товар удален из меню' });
});

app.get('/api/admin/promocodes', (req, res) => {
    res.json(readData(PROMOCODES_FILE));
});

app.post('/api/admin/promocodes', (req, res) => {
    const promos = readData(PROMOCODES_FILE);
    const newPromo = {
        code: req.body.code.toUpperCase(),
        type: req.body.type, // 'percent' или 'fixed'
        value: Number(req.body.value),
        minOrderSum: Number(req.body.minOrderSum) || 0,
        expiresAt: req.body.expiresAt,
        isActive: true
    };
    promos.push(newPromo);
    writeData(PROMOCODES_FILE, promos);
    res.status(201).json({ message: 'Промокод создан', promo: newPromo });
});

app.delete('/api/admin/promocodes/:code', (req, res) => {
    let promos = readData(PROMOCODES_FILE);
    promos = promos.filter(p => p.code !== req.params.code);
    writeData(PROMOCODES_FILE, promos);
    res.json({ message: 'Промокод удален' });
});

app.post('/api/promocode/validate', (req, res) => {
    const { code, orderSum } = req.body;
    
    if (!code) {
        return res.status(400).json({ message: 'Введите промокод' });
    }

    const promos = readData(PROMOCODES_FILE);
    
    const foundPromo = promos.find(p => p.code.toUpperCase() === code.trim().toUpperCase());

    if (!foundPromo) {
        return res.status(404).json({ message: 'Неверный промокод' });
    }

    if (!foundPromo.isActive) {
        return res.status(400).json({ message: 'Этот промокод неактивен' });
    }

    if (foundPromo.expiresAt && new Date(foundPromo.expiresAt) < new Date()) {
        return res.status(400).json({ message: 'Срок действия промокода истек' });
    }

    if (orderSum < foundPromo.minOrderSum) {
        return res.status(400).json({ 
            message: `Минимальная сумма заказа для этого промокода: ${foundPromo.minOrderSum} ₽` 
        });
    }

    const clientType = foundPromo.type === 'fixed' ? 'fix' : 'percent';

    res.json({
        code: foundPromo.code,
        type: clientType,
        value: foundPromo.value
    });
});

app.listen(PORT, () => {
    console.log(`Сервер BurgerSpot запущен локально на порту ${PORT}`);
});
