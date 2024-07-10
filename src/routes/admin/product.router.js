const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../../models/productModel');
const Category = require('../../models/categoryModel');

// Configuración de Multer para almacenar archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único para evitar conflictos
    }
});

const upload = multer({ storage: storage });

// Middleware para obtener todas las categorías disponibles
router.use(async (req, res, next) => {
    try {
        const categories = await Category.findAll();
        res.locals.categories = categories;
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.render('admin/products', { products });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Renderizar formulario para crear un nuevo producto
router.get('/new', (req, res) => {
    res.render('admin/newProduct');
});

// Crear un nuevo producto
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const image = req.file.filename;
        await Product.create({ name, description, price, stock, categoryId, image });
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Renderizar formulario para editar un producto
router.get('/:id/edit', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.render('admin/editProduct', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Actualizar un producto
router.post('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        let image = req.file ? req.file.filename : req.body.currentImage;

        // Si no se sube una nueva imagen, se mantiene la imagen existente
        if (!req.file) {
            const product = await Product.findByPk(req.params.id);
            image = product.image;
        }

        await Product.update({ name, description, price, stock, categoryId, image }, { where: { id: req.params.id } });
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar un producto
router.post('/:id/delete', async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
