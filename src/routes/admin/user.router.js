const express = require('express');
const router = express.Router();
const User = require('../../models/userModel'); // Asegúrate de que la ruta al modelo sea correcta

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('admin/users', { users });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
