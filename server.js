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

app.get('/easyCourses', (req, res) => {
    //const sql = "SELECT c.CRN, c.Title, c.Instructor FROM Courses c NATURAL JOIN Ratings r WHERE r.Difficulty <= 3 AND r.InstructorRating >= 3 AND c.Department = 'CS' UNION SELECT c.CRN, c.Title, c.Instructor FROM Courses c NATURAL JOIN Ratings r WHERE r.Difficulty <= 4 AND r.InstructorRating >= 3 AND c.Department = 'ECE'";

    const sql = "SELECT c.CRN, c.Title, c.Instructor FROM Courses c JOIN Ratings r USING (CRN) WHERE r.Difficulty <= 3 AND r.InstructorRating >= 3 AND c.Department = 'CS' UNION SELECT c.CRN, c.Title, c.Instructor FROM Courses c JOIN Ratings r USING (CRN) WHERE r.Difficulty <= 4 AND r.InstructorRating >= 2.5 AND c.Department = 'ECE'"

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

app.get('/instructorEasyCourse', (req, res) => {
   // const sql = "SELECT r.CRN, r.Instructor, r.Title FROM Ratings r NATURAL JOIN Courses c WHERE r.Difficulty = (SELECT MIN(r2.Difficulty) FROM Ratings r2 WHERE r2.Instructor = r.Instructor) AND Department = 'CS' GROUP BY CRN, Instructor, Title";

    const sql = "SELECT r.CRN, r.Instructor, r.Title FROM Ratings r JOIN Courses c USING (CRN) WHERE r.Difficulty = (SELECT MIN(r2.Difficulty) FROM Ratings r2 WHERE r2.Instructor = r.Instructor) AND Department = 'CS' GROUP BY CRN, Instructor, Title";

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

/* ADVISORS */
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


/* STUDENTS */
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


/* COURSES */
app.post('/courses', (req, res) => {
    const CRN = parseInt(req.body.crn);
    const Title = req.body.title;
    const Department = req.body.department;
    const Instructor = req.body.instructor;

    const sql = `INSERT INTO Courses (CRN, Title, Department, Instructor) VALUES (${CRN}, '${Title}', '${Department}', '${Instructor}');`;

    console.log(sql);
    connection.query(sql, (err, result) => {
        if (err) {
                     res.send(err);
                     return; 
        }
    });
});

app.delete('/courses', function(req, res) {
    const CRN = parseInt(req.body.crn);
    const Title = req.body.title;
    const Department = req.body.department;
    const Instructor = req.body.instructor;

    var crnStr = "";
    var titleStr = "";
    var deptStr = "";
    var instrStr = "";

    if (CRN != undefined) {
        crnStr = `CRN = ${CRN} AND `;
    }
    if (Title != undefined) {
        titleStr = `Title = '${Title}' AND `;
    }
    if (Department != undefined) {
        deptStr = `Department = '${dept}' AND `;
    }
    if (Instructor != undefined) {
        instrStr = `Instructor = '${Instructor}' AND `;
    }

    let sql = `DELETE FROM Courses WHERE ${crnStr}${titleStr}${deptStr}${instrStr}`;
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


/* ENROLLMENTS */
app.post('/enrollments', (req, res) => {
    const CRN = parseInt(req.body.crn);
    const NetID = req.body.netid;
    const Credits = parseInt(req.body.credits);

    const sql = `INSERT INTO Enrollments (CRN, NetID, Credits) VALUES (${CRN}, '${NetID}', ${Credits});`;

    console.log(sql);
    connection.query(sql, (err, result) => {
        if (err) {
                     res.send(err);
                     return;
        }
    });
});

app.delete('/enrollments', function(req, res) {
    const CRN = parseInt(req.body.crn);
    const NetID = req.body.netid;
    const Credits = parseInt(req.body.credits);

    var crnStr = "";
    var netidStr = "";
    var crdStr = "";

    if (CRN != undefined) {
        crnStr = `CRN = ${CRN} AND `;
    }
    if (NetID != undefined) {
        netidStr = `NetID = '${NetID}' AND `;
    }
    if (crdStr != undefined) {
        crdStr = `Credits = ${Credits} AND `;
    }

    let sql = `DELETE FROM Enrollments WHERE ${crnStr}${netidStr}${crdStr}`;
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


/* RATINGS */
app.post('/ratings', (req, res) => {
    const RatingID = req.body.ratingid;
    const CRN = parseInt(req.body.crn);
    const Title = req.body.title;
    const Instructor = req.body.instructor;
    const Difficulty = parseInt(req.body.difficulty);
    const HoursPerWeek = parseInt(req.body.hoursperweek);
    const InstructorRating = parseInt(req.body.instructorrating);

    const sql = `INSERT INTO Ratings (CRN, Title, Instructor, Difficulty, HoursPerWeek, InstructorRating) VALUES (${CRN}, '${Title}', '${Title}', '${Instructor}', ${Difficulty}, ${HoursPerWeek}, ${InstructorRating});`;

    console.log(sql);
    connection.query(sql, (err, result) => {
        if (err) {
            res.send(err);
            return;
        }
    });
});

app.delete('/ratings', function(req, res) {
    const RatingID = req.body.ratingid;
    const CRN = parseInt(req.body.crn);
    const Title = req.body.title;
    const Instructor = req.body.instructor;
    const Difficulty = parseInt(req.body.difficulty);
    const HoursPerWeek = parseInt(req.body.hoursperweek);
    const InstructorRating = parseInt(req.body.instructorrating);

    var ratingidStr = "";
    var crnStr = "";
    var titleStr = "";
    var instrStr = "";
    var diffStr = "";
    var hpwStr = "";
    var irStr = "";

    if (rating != undefined) {
        ratingidStr = `RatingID = ${RatingID} AND `;
    }
    if (CRN != undefined) {
        crnStr = `CRN = ${CRN} AND `;
    }
    if (Title != undefined) {
        titleStr = `Title = '${Title}' AND `;
    }
    if (Instructor != undefined) {
        instrStr = `Instructor = '${Instructor}' AND `;
    }
    if (Difficulty != undefined) {
        diffStr = `Difficulty = ${Difficulty} AND `;
    }
    if (HoursPerWeek != undefined) {
        hpwStr = `HoursPerWeek = ${HoursPerWeek} AND `;
    }
    if (InstructorRating != undefined) {
        irStr = `InstructorRating = ${InstructorRating} AND `;
    }

    let sql = `DELETE FROM Ratings WHERE ${ratingidStr}${crnStr}${titleStr}${instrStr}${diffStr}${hpwStr}${irStr}`;
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


app.get('/success', function(req, res) {
      res.send({'message': 'Attendance marked successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var netid = req.body.netid;
   
  var sql = `INSERT INTO attendance (netid, present) VALUES ('${netid}',1)`;
	// TODO


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


