const Country = require('../models/country')
const countrySeed = require('../mockdata/country')
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
                if(collectionName == "countries"){
                    console.log("countries Collection Exists in DB");
                    mongoose.connection.db.dropCollection(
                        "countries",
                        function(err, result) {
                            console.log("Collection droped");
                        }
                    );

                   
                    return
                } else{
                    console.log("countries Collection Does not Exists in DB");
                    return
                }
            })

            createCountries()
        }
    });
});


//create records
function createCountries(){
    const countries = [ ]  
    countrySeed.map((country, index) =>{
        countries.push(
            new Country({name:country.name})
        )
    })


    let done = 0

    countries.forEach((country) => {
        country.save((err, result) => {
            done++
            if(done == countries.length){
                exit()
            }
        })
    })
}   

//disconnect from Database
function exit(){
   mongoose.disconnect()
}