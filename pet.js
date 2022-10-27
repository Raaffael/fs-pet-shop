var process = require('node:process');
var fs = require('node:fs');

var input = process.argv;

run();

function run(){
    var task = process.argv[2];
    if(input.length<3){
        console.error('Usage: node pets.js [read | create | update | destroy]');
        process.exitCode = 1;
    }else if(task === 'read'){
        read();
    }else if(task === 'create'){
        create();
    }
}

function read(){
    fs.readFile('pets.json','utf-8', function(error,data){
        if(error){
            console.error(error)
        }else{
            var pets = JSON.parse(data);
            var petIndex = input[3];
            if(pets[petIndex]===undefined){
                console.error('Usage: node pets.js read INDEX')
                process.exitCode = 2;
            }else{
                console.log(pets[petIndex]);
            }
        }
    })

}
function create(){
    var age = input[3];
    var kind = input[4];
    var name = input[5];
    if(age===undefined||kind===undefined||name==undefined){
        console.error('Usage: node pets.js create AGE KIND NAME')
        process.exitCode = 3;
    }else{
        var updatedPets = [];
        var petToAdd = {
            'age':parseInt(age),
            'kind':kind,
            'name':name
        }
        fs.readFile('pets.json','utf-8', function(error,data){
            if(error){
                console.error(error)
            }else{
                updatedPets = JSON.parse(data);
            }
            updatedPets.push(petToAdd);
            write(updatedPets);
        })
    }    
}

function write(updatedPets){
    fs.writeFile('pets.json', JSON.stringify(updatedPets), function(error){
        if(error){
            console.error(error);
        }else{
            console.log(updatedPets);
        }
    })

}