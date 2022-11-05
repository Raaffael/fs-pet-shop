const express = require('express');
const app = express();
const { Client } = require('pg');
app.use(express.json());
const PORT = 3000;

const connectionString = 'postgresql://postgres:docker@127.0.0.1:5432/pets'
const client = new Client({
    connectionString: connectionString
})
client.connect();

//Gets all pets from database
app.get('/pets', function (req, res, next) {
    getAllPets(req, res, next);
})
//Gets one pet from database referenced by its id
app.get('/pets/:petID', function (req, res, next) {
    var petID = req.params.petID;
    getOnePet(req, res, petID, next);
})
//Adds a new pet to the database
app.post('/pets', function (req, res, next) {
    var petID = req.params.petID;
    postPet(req, res, petID, next);
})
//Edits a pet from the database
app.patch('/pets', function (req, res, next) {
    patchPet(req, res, next);
})
//Removes a pet from the database
app.delete('pets/:petID', function (req, res, next) {
    const petID = req.params.petID;
    deletePet(req, res, petID, next);
})



//Handles all unknown routes
app.get('*', function (req, res, next) {
    next({ status: 404, message: 'Not Found' })
})
app.use(function (e, req, res, next) {
    res.status(e.status).json({ error: e })
})
app.listen(PORT, function () {
    console.log(`server is running on ${PORT}`);
})



async function getAllPets(req, res, next) {
    try {
        const result = await client.query(`SELECT * FROM pets;`)
        console.log(result.rows)
        res.send(result.rows);
    } catch (error) {
        next(error);
    }
}
async function getOnePet(req, res, petID, next) {
    try {
        const result = await client.query(`SELECT * FROM pets WHERE id = ${petID};`)
        console.log(result.rows.length);
        if (result.rows.length = 0) {
            return next({ status: 404, message: 'Not Found' })

        }
        res.send(result.rows);
    } catch (error) {
        next(error)
    }
}
async function postPet(req, res, petID, next) {
    try {
        const petToAdd = req.body;
        const values = [petToAdd.age, petToAdd.kind, petToAdd.name];
        const text = 'INSERT INTO pets (age,kind,name) VALUES($1,$2,$3) RETURNING *';
        const result = await client.query(text, values);
        console.log(result.rows)
        res.send(result.rows);
    } catch (error) {
        next(error);
    }
}
async function patchPet(req, res, next) {
    //UPDATE owners SET age = 30 WHERE name = 'Jane';
    try {
        const petToEdit = req.body;
        const values = [petToEdit.age, petToEdit.kind, petToEdit.name];
        if (values[0] === undefined || values[0] === undefined || values[0] === undefined) {
            return next({ status: 404, message: 'Not Found' });
        }
        const text = 'UPDATE pets SET age=$1, kind=$2, name=$3 WHERE name=$3 RETURNING *';
        const result = await client.query(text, values);
        console.log(result.rows)
        res.send(result.rows);
    } catch (error) {
        next(error);
    }
}
async function deletePet(req, res, petID, next) {
    //DELETE FROM owners WHERE name = 'Janet';
    try {
        const text = 'DELETE FROM pets WHERE id = $1 RETURNING *';
        const result = await client.query(text, [petID]);
        console.log(result.rows)
        res.send(result.rows);
    } catch (error) {
        next(error);
    }
}



//curl -X POST http://localhost:3000/pets -d '{"age":"25","kind":"cat","name":"pablo"}' -H "Content-Type: application/json"