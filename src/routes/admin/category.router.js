const express = require('express');
const router = express.Router();
const Category = require('../../models/categoryModel'); // Asegúrate de que la ruta del modelo sea correcta

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render('admin/categories', { categories });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Renderizar formulario para agregar una nueva categoría
router.get('/new', (req, res) => {
    res.render('admin/newCategory');
});

// Crear una nueva categoría
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        await Category.create({ name, description });
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Renderizar formulario para editar una categoría
router.get('/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        res.render('admin/editCategory', { category });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Editar una categoría
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        await Category.update({ name, description }, { where: { id } });
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Eliminar una categoría
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Category.destroy({ where: { id } });
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

