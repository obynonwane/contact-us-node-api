const expressJwt = require('express-jwt')


exports.requireSignin = expressJwt({

    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",   //if the token is valid add the verified user ID to the auth property
    
})