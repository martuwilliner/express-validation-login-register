const User = require('../models/User')

function userLoggedMiddleware (req, res, next) {
    res.locals.isLogged = false;
    
    let emailInCookie = req.cookies.userEmail;
    let userInCookie = User.findByField('email', emailInCookie)

    if (userInCookie) {
        req.session.userLogged = userInCookie
    }

    if(req.session.userLogged) {
        res.locals.isLogged = true;

        res.locals.userLogged = req.session.userLogged; // con esto podemos ahora si pasar por ejs lo que trae userLogger como avatar, name,etc

    }

    


    next();
}  

module.exports = userLoggedMiddleware;