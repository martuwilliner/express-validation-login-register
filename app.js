const express = require('express');
const sesion = require('express-session');
const app = express();

app.use(sesion({
    secret: "secretoes",
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({ extended: false })); //capturamos lo que viene del formulario x post

app.use(3200, () => console.log('Servidor levantado en el puerto 3200'));

// Template Engine
app.set('view engine', 'ejs');

//Routers
const mainRoutes = require ('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes')

app.use('/', mainRoutes);
app.use('/user', userRoutes);