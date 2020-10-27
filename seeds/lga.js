const Lga = require('../models/lga')
const State = require('../models/state')
const lgaSeed = require('../mockdata/state')
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

            names.forEach((name, index) => {
                console.log(name.name)
                let collectionName = name.name
                if(collectionName == "lgas"){
                    console.log("lgas Collection Exists in DB");
                    // mongoose.connection.db.dropCollection(
                    //     "lgas",
                    //     function(err, result) {
                    //         console.log("Collection droped");
                    //     }
                    // );  

                   
                    return
                } else{
                    console.log("lgas Collection Does not Exists in DB");
                    return
                }
            })

            createLgas()
        }
    });
});


//create records
function createLgas(){
    const lgas = []  
    let paramName = ''
    State.findOne({})
    lgaSeed.map((lga) =>{
        if(lga.state.name == 'Bauchi'){
            let stateId = '5f92fe6ce8948526ee78cf19'
            let localget = lga.state.locals
            console.log(localget)
            localget.map((newLga, index) => {
                lgas.push(
                    new Lga({name:newLga.name, stateId:stateId})
                
                )
            })
        }
    })


    let done = 0

    lgas.forEach((lga) => {
        lga.save((err, result) => {
            done++
            if(done == lgas.length){
                exit()
            }
        })
    })
}   

//disconnect from Database
function exit(){
   mongoose.disconnect()
}