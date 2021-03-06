let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let path = require('path');
let mysql = require('mysql');
let session = require('express-session');

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

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'orangeblock9',
    database: 'WatJobs'
});

connection.connect(function(err) {
    if(err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    console.log(req.session.username);
    res.render('login');
 });

app.get('/jobScreen/:parameter', function(req, res) {

    if (typeof(req.session.username) != "undefined") {
        let username = req.session.username;
        let orderBy = req.params.parameter;
        let orderMethod = 'ASC';
        orderBy = orderBy.slice(1);

        if (orderBy == 'ranking' || orderBy == 'salaryHour') {
            let query = 'SELECT * FROM job WHERE userID = \"' + username + '\" ORDER BY ' + orderBy + ' ' + orderMethod;
        }
        console.log(username);
        let query = 'SELECT * FROM job WHERE userID = \"' + username + '\" ORDER BY ' + orderBy + ' ' + orderMethod;
        connection.query(query, function(error, results, fields) {
            //console.log(results[0]);
            res.render('jobScreen', {'data': results, 'username': username});
        });
    } else {
        res.render('jobScreen', {'username': "Log In"});
    }
    
});

app.get('/addjob', function(req, res) {
    if (typeof(req.session.username) != "undefined") {
        res.render('addJob', {'username': req.session.username});
    } else {
        res.render('addJob', {'username': "Log In"});
    }
});

app.get('/login', function(req, res) {
    if (typeof(req.session.username) != "undefined") {
        res.render('login', {'username': req.session.username});
    } else {
        res.render('login', {'username': "Log In"});
    }
});

app.get('/createAccount', function(req, res) {
    if (typeof(req.session.username) != "undefined") {
        res.render('createAccount', {'username': req.session.username});
    } else {
        res.render('createAccount', {'username': "Log In"});
    }
});

app.post('/create-account', function(request, response) {
    console.log('Creating an account');
	var username = request.body.username;
    var password = request.body.password;
    var program = request.body.program;
	if (username && password) {
		connection.query('SELECT username FROM user WHERE username = ?', username, function(error, results, fields) {
			if (results.length <= 0) {
                console.log(`Creating user ${username}, with password ${password}`);
                connection.query('INSERT INTO user VALUES (?,?,?,NULL)', [username, password, program], function(error, results, fields) {
                    if(error) {
                        console.log('Error inserting into database');
                    }
                });
                response.redirect('/login')
			} else {
                console.log('Username already exists, would you like to log in?');
                response.redirect('createAccount');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/auth', function(request, response) {
    console.log('got to auth screen');
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/jobScreen/:dateInserted');
			} else {
                //Send an invalid account alert
				response.redirect('/login');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/insert-job', function(request, response) {
    let company = request.body.company;
    let position = request.body.position;
    let location = request.body.location;
    let salary = request.body.salary;
    let ranking = request.body.ranking;
    let userID = request.session.username;

    if (typeof(request.session.username) == "undefined") {
        response.redirect('/login');
        response.end();
    } else {
        console.log(company + salary + location + position + ranking + " " + userID);
        connection.query('INSERT INTO job VALUES (?, ?, ?, ?, ?, NULL, ?, NOW())', [company, position, location, salary, ranking, userID], function (error, results, fields) {
            if (error) {
                throw err;
            }
        });
        response.redirect('/jobScreen/:dateInserted');
        response.end();
    }
});

app.get('/delete/:id', function (req, res) {
    let jobID = req.params.id;
    
    connection.query('DELETE FROM job WHERE jobID = ?', jobID, function(error, results, fields) {
        if  (error) {
            console.log('Could not delete form table');
        }

        res.redirect('/jobScreen/:dateInserted');
        res.end();
    });
});

app.post('/jobScreen/search', function(req, res) {
   let searchText = req.body.searchInput; 
   let username = req.session.username;
   let query = "select * from job where userID = \"" + username + "\" and company like \"%" + searchText + "%\"";
   console.log(query);

   connection.query(query, function(error, results, fields) {
        res.render('jobScreen', {'data': results, 'username': username});
   });
});

console.log("App listening on port 3000");