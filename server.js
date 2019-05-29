require('dotenv').config();
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var met = require('method-override')
var path = require('path')
var mysql = require('mysql');
var db

if (process.env.DB_URL) {
  db = mysql.createConnection(process.env.DB_URL)

} else {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
}
 
db.connect(); 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/insert', function(req, res){
	db.query('INSERT INTO friends (name, picture_link) VALUES (?,?)', [req.body.name, req.body.photo],function (error, results, fields) {
	  if (error) res.json({error : error})
	  else 
	  	res.json({
	  		id : results.insertId
	  	})
	});
});

app.post('/insert/:id', function(req, res){
	db.query('INSERT INTO scores (question_id, friend_id, score) VALUES (?,?,?)', [req.body.question_id, req.params.id, req.body.score],function (error, results, fields) {
	  if (error) res.json({error : error})
	  else res.json({message : "success"})
	});
});


app.get('/question', function(req, res){
	db.query('SELECT * FROM questions', function (error, results, fields) {
	  if (error) res.send(error)
	  else res.json(results);
	});
});


app.get("/friends", function(req, res) {
	var arr = [];
	var obj = {};
	db.query('SELECT DISTINCT friends.name, friends.picture_link, GROUP_CONCAT(scores.score ORDER BY scores.question_id SEPARATOR", ") as scores FROM friends LEFT JOIN scores on friends.id=scores.friend_id GROUP BY friends.id', function (error, results, fields) {
	  if (error) res.send(error)
	  else {
	  	for (var i = 0; i < results.length; i++){
				obj["name"] = results[i].name;
	  		obj["picture_link"] = results[i].picture_link;
	  		obj["scores"] = results[i].scores
				arr.push(obj);
	  	}
	  	res.json(arr)
	  }
	});
});

app.listen(process.env.PORT || 3000, function() {
  var port = process.env.PORT || 3000
  console.log('listening on '+port);
});