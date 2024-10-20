const bcrypt = require("bcrypt");

function encryptPassword(password){
    return bcrypt.hashSync(password,parseInt(process.env.SALT_ROUNDS));

}

function comparePassword(password, hasPassword){
    return bcrypt.compareSync(password, hasPassword);
}

module.exports ={
    encryptPassword,
    comparePassword
};