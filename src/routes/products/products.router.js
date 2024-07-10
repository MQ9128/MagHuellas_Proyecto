const express = require('express');
const router = express.Router();
const Category = require('../../models/categoryModel'); // Importa el modelo de categoría

router.get('/', async (req, res) => {
    try {
        const categorias = await Category.findAll({
            include: 'products' // Incluye los productos asociados a cada categoría
        });

        res.render('productos', {
            categorias: categorias
        });
    } catch (err) {
        console.error('Error al obtener categorías y productos:', err);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;




