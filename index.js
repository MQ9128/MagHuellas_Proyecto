//crear servidor 
require('dotenv').config()
const express = require('express')
const routerMag = require('./src/routes')
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passportConfig = require('./config/passport')
const sequelize = require('./config/db/sequelize');
const multer = require('multer');


const app = express()
const PORT = process.env.PORT || 3000 

app.use(express.json())
//midelware para parser 
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method')); 
app.use(express.static('public'));



//Middleware para manejar cookies y sesiones
app.use(cookieParser());
app.use(session({
    secret: 'KMDsina09ujdDCJkajsd',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true si usas HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

app.use((req, res, next) =>{
    next()
})


app.set('views', './src/views')
app.set('view engine', 'ejs')


//Configuración de passport
passportConfig(app);

//rutas
routerMag(app)

// Sincronizar todos los modelos
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Tablas sincronizadas');
        app.listen(PORT, () => {
            console.log('Listening on port:' + PORT);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar las tablas:', error);
    });

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
