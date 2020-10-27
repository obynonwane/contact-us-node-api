const Permission = require('../models/permission')
const permissionSeed = require('../mockdata/permissions')
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
                if(collectionName == "permissions"){
                    console.log("permissions Collection Exists in DB");
                    mongoose.connection.db.dropCollection(
                        "permissions",
                        function(err, result) {
                            console.log("Collection droped");
                        }
                    );

                   
                    return
                } else{
                    console.log("permissions Collection Does not Exists in DB");
                    return
                }
            })

            createPermissions()
        }
    });
});


//create records
function createPermissions(){
    const permissions = [ ]  
    permissionSeed.map((permission, index) =>{
        permissions.push(
            new Permission({name:permission.name})
        )
    })


    let done = 0

    permissions.forEach((permission) => {
        permission.save((err, result) => {
            done++
            if(done == permissions.length){
                exit()
            }
        })
    })
}   

//disconnect from Database
function exit(){
   mongoose.disconnect()
}