require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const Product = require('./models/Product');
const Order = require('./models/Order');
const Promocode = require('./models/Promocode');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB успешно подключена в облаке!'))
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Сервер BurgerSpot работает на MongoDB');
});

app.get('/api/products', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).lean();
        
        const formattedProducts = products.map(p => ({
            ...p,
            _id: p._id.toString()
        }));

        res.json(formattedProducts || []); 
    } catch (error) {
        console.error('Ошибка в GET /api/products:', error);
        res.status(500).json({ message: 'Ошибка при получении товаров', error: error.message });
    }
});


app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Товар не найден' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Некорректный ID товара', error });
    }
});

app.post('/api/admin/products', async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            price: Number(req.body.price),
            popularity: 0,
            isAvailable: true
        });
        await newProduct.save();
        res.status(201).json({ message: 'Товар успешно добавлен', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при сохранении товара', error });
    }
});

app.put('/api/admin/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, price: Number(req.body.price) },
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Товар не найден' });
        res.json({ message: 'Товар успешно обновлен', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении товара', error });
    }
});

app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Товар не найден' });
        res.json({ message: 'Товар удален из меню' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении товара', error });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        console.log('Пришел заказ с фронта:', req.body);
        
        const orderData = {
            ...req.body,
            status: 'new'
        };

        const newOrder = new Order(orderData);
        await newOrder.save();
        
        res.status(201).json({ message: 'Заказ успешно оформлен!', orderId: newOrder._id });
    } catch (error) {
        console.error('ОШИБКА ПРИ СОХРАНЕНИИ ЗАКАЗА:', error.message);
        res.status(500).json({ message: 'Ошибка сервера при заказе', details: error.message });
    }
});


app.get('/api/admin/orders', async (req, res) => {
    try {
        console.log('ПРИШЛО С ФРОНТА:', req.body);
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении заказов', error });
    }
});

app.patch('/api/admin/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: 'Заказ не найден' });
        res.json({ message: 'Статус заказа обновлен', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении статуса', error });
    }
});

app.delete('/api/admin/orders/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Заказ не найден' });
        res.json({ message: 'Заказ успешно удален из архива' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении заказа', error });
    }
});

app.get('/api/admin/promocodes', async (req, res) => {
    try {
        const promos = await Promocode.find();
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении промокодов', error });
    }
});

app.post('/api/admin/promocodes', async (req, res) => {
    try {
        const newPromo = new Promocode({
            code: req.body.code.toUpperCase(),
            type: req.body.type,
            value: Number(req.body.value),
            minOrderSum: Number(req.body.minOrderSum) || 0,
            expiresAt: req.body.expiresAt,
            isActive: true
        });
        await newPromo.save();
        res.status(201).json({ message: 'Промокод создан', promo: newPromo });
    } catch (error) {
        res.status(500).json({ message: 'Такой промокод уже существует или данные неверны', error });
    }
});

app.delete('/api/admin/promocodes/:code', async (req, res) => {
    try {
        const deletedPromo = await Promocode.findOneAndDelete({ code: req.params.code.toUpperCase() });
        if (!deletedPromo) return res.status(404).json({ message: 'Промокод не найден' });
        res.json({ message: 'Промокод удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении промокода', error });
    }
});

app.post('/api/promocode/validate', async (req, res) => {
    try {
        const { code, orderSum } = req.body;
        if (!code) return res.status(400).json({ message: 'Введите промокод' });

        const foundPromo = await Promocode.findOne({ code: code.trim().toUpperCase() });

        if (!foundPromo) return res.status(404).json({ message: 'Неверный промокод' });
        if (!foundPromo.isActive) return res.status(400).json({ message: 'Этот промокод неактивен' });

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
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при проверке промокода', error });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер BurgerSpot запущен на порту ${PORT}`);
});
