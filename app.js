const express = require('express')
//third party import
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path');


//excutes express
const app = express()
const expressValidator = require('express-validator')


//configure dotenv
dotenv.config()


//connect to db
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true}).then(() => {console.log('connected')})
mongoose.connection.on('error', error => {console.log(`DB Connection ${error.message}`)})

//configuring multer
const fileStorage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'images')
    },
    filename:(req, file, cb) => {
        cb(null,new Date().toISOString() +'-'+file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

//custom imports
const coutryRoute = require('./routes/country')
const authRoute = require('./routes/auth')
const roleRoute = require('./routes/role')
const userRoute = require('./routes/user')
const stateRoute = require('./routes/state')
const lgaRoute = require('./routes/lga')
const permissionRoute = require('./routes/permission')

//custom middleware
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'))
app.use(cookieParser())
app.use(expressValidator())



//routes middleware
app.use('/',coutryRoute)
app.use('/',authRoute)
app.use('/',roleRoute)
app.use('/',userRoute)
app.use('/',permissionRoute)
app.use('/',stateRoute)
app.use('/',lgaRoute)

//middle to the path where user profile image is stored
app.use('/images',express.static(path.join(__dirname, 'images')))

//use it after routes 
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});


const port = process.env.PORT
app.listen(port, () => {console.log(`A new Node JS API is listening on port: ${port}`)})