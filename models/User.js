// representa al database. Es como el controller

// 4. Editar la informacion de un user


const fs = require('fs');

const User = {

    fileName = './database/users.json', 

    getData = function () {
        return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
    },
    //Generar ID para nuevos users
    generateId: function () {
        let allUsers = this.findAll();
        let lastUser = allUsers.pop();

        if(lastUser) {
            return lastUser.id + 1;
        }
        return 1
        
    },


    // 6. Buscar a todos los users
    findAll: function(){
        return this.getData
    },
    // 3. Buscar a un usuario por su ID 
    findByPk: function(id){
        let allUsers = this.findAll();
        let userFind = allUsers.find(oneUser => oneUser.id === id);

        return userFind;
    },
    // 2. Buscar al usuario que se quiere loguear por su email
    findByField: function(field, text){
        let allUsers = this.findAll();
        let userFind = allUsers.find(oneUser => oneUser[field] === text);

        return userFind;
    },
    // 1. Guardar al user en la DB 
    create: function (userData) {
        let allUsers = this.findAll();
        let newUser = {
            id: this.generateId(),
            ...userData
        }
        allUsers.push(newUser);

        fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null, ''));
        return newUser;
    },
    // 5. Eliminar user de la DB
    delete: function (id) {
        let allUsers = this.findAll();
        let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
        fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, ''));
        return finalUsers
        
    }
}

module.exports = User;