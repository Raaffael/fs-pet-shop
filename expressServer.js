const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());



app.get('/pets',function(req,res,next){
    fs.readFile('pets.json', 'utf-8', function (error, data) {
        if (error) {
            next(error);
        } else {
            res.send(data);
        }
    })
})
app.get('/pets/:petIndex', function(req,res,next){
    petIndex = req.params.petIndex;
    fs.readFile('pets.json', 'utf-8', function (error, data) {
        if (error) {
            next(error);
        } else {
            petsObject = JSON.parse(data)
            if(petsObject[petIndex]===undefined){
                next({status:404,message:'No pet at this index'})
            }
            res.send(petsObject[petIndex])
        }
    })
})
app.post('/pets',function(req,res,next){
    petToAdd = req.body;
    fs.readFile('pets.json','utf-8',function(error,data){
        if(error){
            next(error);
        } else{
            var allPets = JSON.parse(data);
            if (petToAdd.age === undefined || petToAdd.kind === undefined || petToAdd.name == undefined) {
                next({status:404, message:'Not Here'});
            }else{
                //allPets = JSON.parse(data);
                allPets.push(petToAdd);
            }
            write(allPets);
        }
    })
    res.send(req.body);
})
app.get('*',function(req,res,next){
    next({status:404, message:'Not Found Here'})
})
app.use(function(err,req,res,next){
    res.status(err.status).json({error:err})
})
app.listen(3000, function(){
    console.log('server is running');
})

function write(updatedPets){
    fs.writeFile('pets.json',JSON.stringify(updatedPets),function(error){
        next(error);
    })
}






//curl -X POST http://localhost:3000/pets -d '{"age":"25","kind":"cat","name":"pablo"}' -H "Content-Type: application/json"