let jwt = require('jsonwebtoken');

const validate = token =>{
    try {
        const data = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
        if(data && data.exp > + new Date()){
            return data;
        }
    }
    catch (e) {
        return false;
    }
};
module.exports = validate;