
const User = require('../models/user')

class requestValidator {
    signupValidator (req, res, next) {
        //name is not null and between 4 - 10 characters
        req.check('first_name', "First name is required").notEmpty()
        req.check('surname', "Surname is required").notEmpty()
        req.check('email', "Email required").notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min:4,
            max:2000
        })
       
        //Phone Validation
        req.check('phone', "Phone Number is required").notEmpty()
 

        //password validation
        req.check('password', "Password is required").notEmpty()
        req.check('password')
        .isLength({min:6})
        .withMessage("Password Must contain atleast Six Characters")
        .matches(/\d/)
        .withMessage('Password must contain a number')
       
        //compare password and comfirm password
        if(req.body.password != req.body.confirm_password){
          return res.status(400).json({error:'Confirm Password not same as password'})
        }

        //check for all the errors and loop through to pick the first one
        const errors = req.validationErrors()
        if(errors){
            const firstError = errors.map(error => error.msg)[0]
            return res.status(400).json({
                error:firstError
            })
        }
    
        //proceed to next middleware
        next()
    }


}


module.exports = requestValidator