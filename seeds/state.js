const State = require('../models/state')
const stateSeed = require('../mockdata/state')
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
                if(collectionName == "states"){
                    console.log("states Collection Exists in DB");
                    mongoose.connection.db.dropCollection(
                        "states",
                        function(err, result) {
                            console.log("Collection droped");
                        }
                    );  

                   
                    return
                } else{
                    console.log("states Collection Does not Exists in DB");
                    return
                }
            })

            createStates()
        }
    });
});


//create records
function createStates(){
    const states = [ ]  
    stateSeed.map((state, index) =>{
        let country_id = '5f91a72d24b69ae6a6b53cf6'
        states.push(
            new State({name:state.state.name, countryId:country_id})
        
        )
    })


    let done = 0

    states.forEach((state) => {
        state.save((err, result) => {
            done++
            if(done == states.length){
                exit()
            }
        })
    })
}   

//disconnect from Database
function exit(){
   mongoose.disconnect()
}