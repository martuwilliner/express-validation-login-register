const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, res, cb) =>{
        cb(null, './public/images/avatars')
    },
    filename: (req, res, cb) =>{
        let fileName= `${Date.now()}_img${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
})

const uploadFile = multer({ storage })

const userController = require('../controllers/userController');

const validations = [
    body('full_name').notEmpty().withMessage('Escribe un nombre real'),
    body('email')
    .notEmpty().withMessage('Escribe un email').bail()
    .isEmail().withMessage('Debes escribir un formato de email valido'),
    body('password').notEmpty().withMessage('Escribe una contraseña'),
    body('country').notEmpty().withMessage('Elegí en pais'),
    body('avatar').custom((value, {req}) => {

        let file = req.file;
        let formats = ['.jpg', '.png', '.gif']
        

        if(!file){
            throw new Error('Tienes que subir una imagen')
        }else{
            let fileExtension = path.extname(file.originalname)
            if(!formats.includes(fileExtension)){
                throw new Error(`Las extensiones permitidas son ${formats.join(',')} `)
            }
        }

        

        return true;

    })
];
//Formulario de registros
router.get('/register', guestMiddleware ,userController.register);

//Procesar el registro
router.post('/register', uploadFile.single('avatar'), validations ,userController.processRegister);


//Formulario de Log in
router.get('/login',guestMiddleware, userController.login);

//Procesar el formulario de Log in
router.post('/login', userController.loginProcess);

//Perfil del usuario
router.get('/profile/', authMiddleware,userController.profile);

//Log out
router.get('/logout/', userController.logout);

module.exports = router;