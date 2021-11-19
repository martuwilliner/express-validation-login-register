const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

const User = require('../models/User') // para que tome los datos desde el registro con los parametros de models

const controller = {
    register: (req, res) => {
        return res.render('userRegisterForm')
    },
    processRegister: (req, res) => {
        const resultValidation = validationResult(req);
        
        if(resultValidation.errors.length > 0) {
            return res.render('userRegisterForm', {
                errors: resultValidation.mapped(),
                oldData: req.body
            })
        }

        let userExist = User.findByField('email', req.body.email);
        
        if(userExist) {
            return res.render('userRegisterForm', {
                errors: {
                    email:{
                        msg: 'Este mail ya se encuentra en nuestra base de datos'
                    }
                },
                oldData: req.body
            })
        }

        let userToCreate = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 10),
            avatar: req.file.filename
        }

        let userCreated = User.create(userToCreate);

        return res.redirect('/user/login')
    },
    login: (req, res) => {
        return res.render('userLoginForm');
    },
    loginProcess: (req, res) => {
        let userToLogin = User.findByField('email', req.body.email);

        if(userToLogin){

            let isOkthePassword = bcrypt.compareSync(req.body.password, userToLogin.password)

            if(isOkthePassword){
                delete userToLogin.password
                req.session.userLogged = userToLogin;

                return res.redirect('/user/profile')
            }

            return res.render('userLoginForm', {
                errors: {
                    email: {
                        msg: 'Las credenciales son inválidas'
                    }
                }
            })

        }

        return res.render('userLoginForm', {
            errors: {
                email: {
                    msg: 'No se encuentra el mail en la base de datos'
                }
            }
        })
    },
    profile: (req, res) => {
        return res.render('userProfile', {
            user: req.session.userLogged
        });
    },
    logout: (req, res) => {
        req.session.destroy() // borra todo lo que está en session
        return res.redirect('/') //home
    }
}

module.exports = controller;