const express = require('express');
const router = express.Router();
const { Cart, CartItem, Product } = require('../../models/productModel');

// Middleware para verificar la autenticación
function extractUserId(req, res, next) {
    if (req.session && req.session.userId) {
        req.userId = req.session.userId;
    }
    next();
}

router.use(extractUserId);

// Agregar un artículo al carrito
router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (req.userId) {
            // Usuario autenticado
            const userId = req.userId;
            let cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                cart = await Cart.create({ userId });
            }

            let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
            if (cartItem) {
                cartItem.quantity += quantity;
                await cartItem.save();
            } else {
                await CartItem.create({ cartId: cart.id, productId, quantity });
            }
        } else {
            // Usuario no autenticado
            if (!req.session.cart) {
                req.session.cart = [];
            }
            const cart = req.session.cart;
            const existingItem = cart.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ productId, quantity });
            }
        }

        res.redirect('/cart');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ver el carrito de compras
router.get('/', async (req, res) => {
    try {
        if (req.userId) {
            // Usuario autenticado
            const userId = req.userId;
            const cart = await Cart.findOne({
                where: { userId },
                include: [{
                    model: CartItem,
                    include: [Product]
                }]
            });

            res.render('cart', { cart: cart ? cart : {} });
        } else {
            // Usuario no autenticado
            const cart = req.session.cart || [];
            // Obtener detalles de productos
            const productDetails = await Promise.all(cart.map(async item => {
                const product = await Product.findByPk(item.productId);
                return {
                    ...item,
                    product
                };
            }));

            res.render('cart', { cart: { items: productDetails } });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar cantidad de un artículo en el carrito
router.post('/update', async (req, res) => {
    try {
        const { cartItemId, quantity } = req.body;

        if (req.userId) {
            // Usuario autenticado
            const cartItem = await CartItem.findByPk(cartItemId);
            if (cartItem) {
                cartItem.quantity = quantity;
                await cartItem.save();
            }
        } else {
            // Usuario no autenticado
            const cart = req.session.cart || [];
            const item = cart.find(item => item.productId === parseInt(cartItemId));
            if (item) {
                item.quantity = quantity;
            }
        }

        res.redirect('/cart');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar un artículo del carrito
router.post('/remove', async (req, res) => {
    try {
        const { cartItemId } = req.body;

        if (req.userId) {
            // Usuario autenticado
            await CartItem.destroy({ where: { id: cartItemId } });
        } else {
            // Usuario no autenticado
            const cart = req.session.cart || [];
            req.session.cart = cart.filter(item => item.productId !== parseInt(cartItemId));
        }

        res.redirect('/cart');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
