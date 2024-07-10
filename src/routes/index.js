const express = require('express')
const authRouter = require('./users/auth.router')
const homeRouter = require('./home/home.router'); 
const productRouter = require('./admin/product.router');
const categoryRouter = require('./admin/category.router');
const userRouter = require('./admin/user.router');
const productsRouter = require('./products/products.router'); 
const cartRouter = require('../routes/carrito/carts.router'); 

function routerMag(app){
    const router = express.Router()

    app.use('/', router) 
    // Ruta para la página de inicio (home)
    router.use('/', homeRouter);
    // Ruta para autenticación
    router.use('/auth', authRouter)
    // Ruta para productos
    router.use('/admin/products', productRouter);
    // Usar las rutas de categorías
    router.use('/admin/categories', categoryRouter);
    // Usar las rutas de usuarios
    router.use('/admin/users', userRouter);
    
    router.use('/productos', productsRouter); // Rutas de productos
    // Rutas del carrito de compras
    router.use('/cart', cartRouter);
}

module.exports = routerMag;
