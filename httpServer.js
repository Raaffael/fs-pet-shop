const http = require('http');
const fs = require('fs');
const port = 3000;

var server = http.createServer(function (req, res) {
    requestHandler(req, res);
})
server.listen(port, function () {
    console.log('Listening on port', port)
})

function requestHandler(req, res) {
    var urlArray = req.url.split('/');
    var index = urlArray[urlArray.length - 1];
    if (req.method === 'GET' && req.url === '/pets') {
        fs.readFile('pets.json', 'utf-8', function (error, data) {
            if (error) {
                console.log(error);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(data)
            }
        })
    } else if (req.method === 'GET' && req.url === `/pets/${index}`) {
        fs.readFile('pets.json', 'utf-8', function (error, data) {
            if (error) {
                console.log(error);
            } else {
                var jsonPetObj = JSON.parse(data);
                if (jsonPetObj[index] === undefined) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Not Found')
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(jsonPetObj[index]))
                }
            }
        })
    } else if (req.method === 'POST' && req.url === '/pets') {
        let body = '';
        req.on('data',chunk=>{
            body+= chunk.toString();
            //convert buffer to stream
        })
        req.on('end',()=>{
            console.log(body);
            res.end('ok')
        })
        let jsonBodyObject = JSON.parse(body);
        if(typeof(jsonBodyObject.age)!=='integer'){
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Bad Request');
        }
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found')
    }

}