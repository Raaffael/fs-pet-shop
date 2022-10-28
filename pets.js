var process = require('node:process');
var fs = require('node:fs');


var input = process.argv;

run();

function run() {
    var task = process.argv[2];
    if (input.length < 3) {
        console.error('Usage: node pets.js [read | create | update | destroy]');
        process.exitCode = 1;
    } else if (task === 'read') {
        read();
    } else if (task === 'create') {
        var age = input[3];
        var kind = input[4];
        var name = input[5];
        create(age, kind, name);
    } else if (task === 'update') {
        var index = input[3];
        var age = input[4];
        var kind = input[5];
        var name = input[6];
        update(index, age, kind, name);
    }else if(task === 'destroy'){
        var index = input[3];
        destroy(index);
    }
}

function read() {
    fs.readFile('pets.json', 'utf-8', function (error, data) {
        if (error) {
            console.error(error)
        } else {
            var pets = JSON.parse(data);
            var petIndex = input[3];
            if (pets[petIndex] === undefined) {
                console.error('Usage: node pets.js read INDEX')
                process.exitCode = 2;
            } else {
                console.log(pets[petIndex]);
            }
        }
    })

}
function create(age, kind, name) {
    if (age === undefined || kind === undefined || name == undefined) {
        console.error('Usage: node pets.js create AGE KIND NAME')
        process.exitCode = 3;
    } else {
        var updatedPets = [];
        var petToAdd = {
            'age': parseInt(age),
            'kind': kind,
            'name': name
        }
        fs.readFile('pets.json', 'utf-8', function (error, data) {
            if (error) {
                console.error(error)
            } else {
                updatedPets = JSON.parse(data);
            }
            updatedPets.push(petToAdd);
            write(updatedPets);
        })
    }
}

function write(updatedPets) {
    fs.writeFile('pets.json', JSON.stringify(updatedPets), function (error) {
        if (error) {
            console.error(error);
        } else {
            console.log(updatedPets);
        }
    })

}

function update(index, age, kind, name) {
    if (index === undefined || age === undefined || kind === undefined || name == undefined) {
        console.error('Usage: node pets.js update INDEX AGE KIND NAME')
        process.exitCode = 4;
    } else {
        var allPets = [];
        fs.readFile('pets.json', 'utf-8', function (error, data) {
            if (error) {
                console.error(error)
            } else {
                allPets = JSON.parse(data);
                var petToUpdate = allPets[index];
                petToUpdate.age = parseInt(age);
                petToUpdate.kind = kind;
                petToUpdate.name = name;
            }
            write(allPets);
        })
    }
}
function destroy(index){
    if(index === undefined){
        console.error('Usage: node pets.js destroy INDEX')
        process.exitCode = 5;
    }else{
        var allPets = [];
        fs.readFile('pets.json', 'utf-8', function (error, data) {
            if (error) {
                console.error(error)
            } else {
                allPets = JSON.parse(data);
                allPets.splice(index,1);
            }
            write(allPets);
        })
    }
}
