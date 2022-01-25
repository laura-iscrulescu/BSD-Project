const express = require('express');
const cors = require('cors');

async function main () {
    try {
        const server = express();
        server.use(express.json());
        //routes
        server.use('/login', cors(), (req, res) => {
            res.sendStatus(403);
        });

        server.use('/authenticator/token', cors(), (req, res) =>{
            console.log("Ruta buna");
            res.sendStatus(200);
        })
        //handles 404 errors
        server.use(function (req, res) {
            console.log(req.headers);
            res.sendStatus(403);
        })

        const PORT = process.argv[2] || 5000;
        server.listen(PORT, console.log(`Server started on port ${PORT}`));
    } catch (err) {
        console.error(err);
        console.error('There was an error while initializing the server. Try again!');
    }
}

main();