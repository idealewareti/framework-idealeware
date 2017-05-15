/* Código simplório, apenas para fornecer o serviço para a aplicação */

var express = require('express')
    ,app = express()
    ,path =  require('path')
    ,bodyParser = require('body-parser');

app.set('sitePath', path.join(__dirname, '../..', 'site'));
console.log(app.get('sitePath'));
app.use(express.static(app.get('sitePath')));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app;