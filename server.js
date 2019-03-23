let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let path = require('path');

//Configure this later
//mongoose.connect('mongodb://node:node')

app.use(express.static(path.join(__dirname, 'public')));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.listen(3000);

app.get('/', function(req, res) {
    res.render('jobScreen');
});

app.get('/addjob', function(req, res) {
    res.render('addJob');
});

console.log("App listening on port 3000");