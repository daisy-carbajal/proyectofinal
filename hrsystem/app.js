var express = require('express');

var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    }) 
});

app.listen(3000, () => {
    console.log('Express Server Puerto: 3000:\x1b[32m%s\x1b[0m','online');
});