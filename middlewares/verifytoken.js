const jwt = require('jsonwebtoken')

exports.validToken = (req, res, next)  => {
    const token = req.header('authorization')
    const usertoken = token.split(" ");
    
    
    if(!usertoken[1]) return res.this.status(400).json({})
    try{
       const verified = jwt.verify(usertoken[1], process.env.JWT_SECRET)
        req.verified_user = verified //gives us access to the user
    
        next()
    }catch(err){
        return res.json({error:'Invalid Token'})
    }
}