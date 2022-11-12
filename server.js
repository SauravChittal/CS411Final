var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.136.120.24',
                user: 'root',
                password: '12345',
                database: 'projectDB'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/:double/:condition/:valuer', function(req, res) {
	console.log(`req ${req} and req.params ${req.params}`);
	if (!Number.isInteger(Number(req.params.valuer))) {
		req.params.valuer = "'" + req.params.valuer + "'";
	}
	const sql = `SELECT * FROM ${req.params.double} WHERE ${req.params.condition} = ${req.params.valuer}`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		//res.redirect('/success');
		res.send(result);
	});
});

app.post('/advisors', function(req, res) {
	const email = req.body.email;
	const first = req.body.firstname;
	const last = req.body.lastname;
	const dept = req.body.department;

	const sql = `INSERT INTO Advisors (Email, FirstName, LastName, Department) VALUES ('${email}', '${first}', '${last}', '${dept}')`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		res.redirect('/success');
	});
});

app.delete('/advisors', function(req, res) {
	const email = req.body.email;
	const first = req.body.firstname;
	const last = req.body.lastname;
	const dept = req.body.department;

	var emailStr = "";
	var firstStr = "";
	var lastStr = "";
	var deptStr = "";

	if (req.body.email != undefined) {
		emailStr = `Email = '${email}' AND `;
	}
	if (req.body.firstname != undefined) {
		firstStr = `FirstName = '${first}' AND `;
	}
	if (req.body.lastname != undefined) {
		lastStr = `LastName = '${last}' AND `;
	}
	if (req.body.department != undefined) {
		deptStr = `Department = '${dept}' AND `;
	}
	let sql = `DELETE FROM Advisors WHERE ${emailStr}${firstStr}${lastStr}${deptStr}`;
	// sql.slice(sql.length - 4);
	sql = sql.substr(0, sql.length - 5);
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		res.redirect('/success');
	});
});

app.put('/:double/:field/:new/:condition/:val', function(req, res) {
	if (!Number.isInteger(Number(req.params.new))) {
		req.params.new = "'" + req.params.new + "'";
	}
	if (!Number.isInteger(Number(req.params.val))) {
		req.params.val = "'" + req.params.val + "'";
	}
	const sql = `UPDATE ${req.params.double} SET ${req.params.field} = ${req.params.new} WHERE ${req.params.condition} = ${req.params.val}`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		res.redirect('/success');
	});

});


app.post('/students', function(req, res) {
	const netid = req.body.netid;
	const adEmail = req.body.advisoremail;
	const first = req.body.firstname;
	const last = req.body.lastname;
	const creds = req.body.credits;

	const sql = `INSERT INTO Students (NetID, AdvisorEmail, FirstName, LastName, Credits) VALUES ('${netid}', '${adEmail}', '${first}', '${last}', ${creds})`;
	
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		// res.redirect('/success');
	});
});

app.delete('/students', function(req, res) {
	const netid = req.body.netid;
	const adEm = req.body.advisoremail;
	const first = req.body.firstname;
	const last = req.body.lastname;
	const cred = req.body.credits;

	var netidStr = "";
	var adEmStr = "";
	var firstStr = "";
	var lastStr = "";
	var credStr = "";

	if (req.body.netid != undefined) {
		netidStr = `NetID = '${netid}' AND `;
	}
	if (req.body.advisoremail != undefined) {
		adEmStr = `AdvisorEmail = '${adEm}' AND `;
	}
	if (req.body.firstname != undefined) {
		firstStr = `FirstName = '${first}' AND `;
	}
	if (req.body.lastname != undefined) {
		lastStr = `LastName = '${last}' AND `;
	}
	if (req.body.credits != undefined) {
		credStr = `Credits = ${cred} AND `;
	}
	let sql = `DELETE FROM Students WHERE ${netidStr}${adEmStr}${firstStr}${lastStr}${credStr}`;
	// sql.slice(sql.length - 4);
	sql = sql.substr(0, sql.length - 5);
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		res.redirect('/success');
	});
});

/*app.put('/students/:field/:new/:condition/:val', function(req, res) {
	if (!Number.isInteger(Number(req.params.new))) {
		req.params.new = "'" + req.params.new + "'";
	}
	if (!Number.isInteger(Number(req.params.val))) {
		req.params.val = "'" + req.params.val + "'";
	}
	const sql = `UPDATE Students SET ${req.params.field} = ${req.params.new} WHERE ${req.params.condition} = ${req.params.val}`;
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		res.redirect('/success');
	});

});*/


app.post('/students', function(req, res) {
	const netid = req.body.netid;
	const adEmail = req.body.advisoremail;
	const first = req.body.firstname;
	const last = req.body.lastname;
	const creds = req.body.credits;

	const sql = `INSERT INTO Students (NetID, AdvisorEmail, FirstName, LastName, Credits) VALUES ('${netid}', '${adEmail}', '${first}', '${last}', ${creds})`;
	
	console.log(sql);
	connection.query(sql, function(err, result) {
		if (err) {
			res.send(err);
			return;
		}
		// res.redirect('/success');
	});
});



app.get('/success', function(req, res) {
      res.send({'message': 'Attendance marked successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var netid = req.body.netid;
   
  var sql = `INSERT INTO attendance (netid, present) VALUES ('${netid}',1)`;



console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});



app.listen(80, function () {
    console.log('Node app is running on port 80');
});


