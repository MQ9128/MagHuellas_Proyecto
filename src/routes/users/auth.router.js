const router = require('express').Router();
const UserModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Renderizar la página de registro
router.get('/signUp', (req, res) => {
    res.render('auth/signUp');
});

// Manejar el registro de usuarios
router.post('/signUp', async (req, res) => {
    try {
        let { name, email, password, birth_date } = req.body;

        // Generar el hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear un nuevo usuario
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            birth_date
        });

        if (user) {
            // Redirigir al usuario a la página de inicio de sesión después de un registro exitoso
            res.redirect('/auth/signIn');
        } else {
            res.render('auth/signUp', { error: 'No se pudo crear el usuario.' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Middleware para verificar si el usuario está autenticado
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/signIn');
}

// Renderizar el perfil del usuario solo si está autenticado
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('auth/profile', { user: req.user });
});

// Renderizar la página de inicio de sesión
router.get('/signIn', (req, res) => {
    res.render('auth/signIn');
});

// Manejar el inicio de sesión
router.post('/signIn', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/auth/signIn',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;
