const Role = require('../models/role')
const roleSeed = require('../mockdata/roles')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')



//connect to db
mongoose.connect("mongodb://127.0.0.1:27017/mypeopledb", {useNewUrlParser:true}).then(() => {console.log('connected')})
mongoose.connection.on('error', error => {console.log(`DB Connection ${error.message}`)})


const connection = mongoose.connection;
connection.once("open", function() {
    console.log("MongoDB connected successfully");
    connection.db.listCollections().toArray(function(err, names) {
        if (err) {
            console.log(err);
        } else {

            names.forEach((name, index)=>{
                console.log(name.name)
                let collectionName = name.name
                if(collectionName == "roles"){
                    console.log("roles Collection Exists in DB");
                    mongoose.connection.db.dropCollection(
                        "roles",
                        function(err, result) {
                            console.log("Collection droped");
                        }
                    );  

                   
                    return
                } else{
                    console.log("roles Collection Does not Exists in DB");
                    return
                }
            })

            createRoles()
        }
    });
});


//create records
function createRoles(){
    const roles = [ ]  
    roleSeed.map((role, index) =>{
        roles.push(
            new Role({name:role.name})
        
        )
    })


    let done = 0

    roles.forEach((role) => {
        role.save((err, result) => {
            done++
            if(done == roles.length){
                exit()
            }
        })
    })
}   

//disconnect from Database
function exit(){
   mongoose.disconnect()
}