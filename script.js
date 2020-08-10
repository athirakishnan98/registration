var http = require("http");
var express = require('express');
var app = express();
var mysql2 = require('mysql2');
var bodyParser = require('body-parser');
var cors = require('cors')

//start mysql connection
var connection = mysql2.createConnection({
    host     : 'localhost', //mysql database host name
    user     : 'root', //mysql database user name
    password : '', //mysql database password
    database : 'user' //mysql database name
});

connection.connect(function(err) {
    if (err) 
        console.log('error')
    else
        console.log('You are now connected...')
})

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(cors());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//create app server
var server = app.listen(3000,  "127.0.0.1", function () {

    var host = server.address().address
    var port = server.address().port
   
    console.log("App listening at http://%s:%s", host, port)
});

//rest api to get all 
app.get('/', function (req, res) {
    connection.query("SELECT * FROM test_table" , function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
        console.log(results)
    });
});

//rest api to get a single record
app.get('/test_table/:id', function (req, res) {
    connection.query('select * from test_table where ID=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to create a new record 
app.post('/', function (req, res) {
   var postData  = req.body;
   connection.query('INSERT INTO test_table SET ?', postData, function (error, results, fields) {
	    if (error) throw error;
	    res.end(JSON.stringify(results));
	});
});

//rest api to update record into mysql database
app.put('/', function (req, res) {
   connection.query("UPDATE `test_table` SET `Name`=?, `Address`=?, `Phnno`=?, `Email`=?, `Country`=? where `ID`= ?", [req.body.Name,req.body.Address, req.body.Phnno, req.body.Email, req.body.Country, req.body.ID], function (error, results, fields) {
	    if (error) throw error;
	    res.end(JSON.stringify(results));
	});
});

//rest api to delete record from mysql database
app.delete('/', function (req, res) {
    console.log(req.body);
    connection.query("DELETE FROM `test_table` WHERE `test_table`.`ID` = ? ", [req.body.ID], function (error, results, fields) {
        if (error) throw error;
        res.end("Record has been deleted!");
        console.log("deleted")
    });
});