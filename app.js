var express = require('express');
var bodyParser = require("body-parser")
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(__dirname + "/public"));
app.use('/static', express.static(__dirname + "/public/css"));
app.use('/static', express.static(__dirname + "/public/js"));

var id;

//mysql
var mysql = require('mysql');
var pool = mysql.createPool({
connectionLimit : 100, //focus it
host : 'localhost',
user : 'root',
password : '',
database : 'students'
});

//opening view
app.get('/', function(req,res){
res.render('index');
});

//insert resource
app.post('/create', function(req,res){
    pool.getConnection(function(error,conn){
    var queryString = "insert into student(firstName,middleName,lastName,age,sex,class) values('"+req.body.firstname+"','"+req.body.middlename+"','"+req.body.lastname+"','"+req.body.age+"','"+req.body.sex+"','"+req.body.class+"')"
    conn.query(queryString,function(error,results){
    if(error)
    {
    throw error;
    }
    else
    {
    res.send('Inserted Successfully!')
    }
    });
    conn.release();
    });

});
//list resource
app.get('/list', function(req,res){
    pool.getConnection(function(error,conn){
    var queryString = 'SELECT studentID,firstName,lastName from student';
    conn.query(queryString,function(error,results){
    if(error)
    {
    throw error;
    }
    else
    {
    console.log(results)
    res.render('list', {data: results})
    }
    });
    conn.release();
    });

});
//view resource
app.get('/view/:studentID', function(req,res){
    pool.getConnection(function(error,conn){
    var queryString = 'SELECT * from student WHERE studentID = ?';
    conn.query(queryString, [req.params.studentID], function(error,results){
    if(error)
    {
    throw error;
    }
    else
    {
    res.render('view', {data: results})
    }
    });
    conn.release();
    });

});
//Get Edit resource
app.get('/edit/:studentID', function(req,res){
    pool.getConnection(function(error,conn){
    var queryString = 'SELECT * from student WHERE studentID = ?';
    conn.query(queryString, [req.params.studentID], function(error,results){
    if(error)
    {
    throw error;
    }
    else
    {
    res.render('edit', {data: results})
    }
    });
    conn.release();
    });

});

//post Edit resource
app.post('/edit/:studentID', function(req,res){
    pool.getConnection(function(error,conn){
    var queryString = "UPDATE student SET firstName=?, middleName=?, lastName=?, age=?, sex=?, class=? WHERE studentID = ?"
    conn.query(queryString, [req.body.firstname, req.body.middlename, req.body.lastname, req.body.age, req.body.sex, req.body.class, req.params.studentID], function(error,results){
    if(error)
    {
    throw error;
    }
    else
    {
    res.send('updated')
    }
    });
    conn.release();
    });

});
//Delete resource
app.get('/delete/:studentID', function(req,res){
    pool.getConnection(function(error,conn){
    var queryString = 'DELETE FROM student WHERE studentID = ?';
    conn.query(queryString, [req.params.studentID], function(error,results){
    if(error)
    {
    throw error;
    }
    else
    {

    res.render('index')
    }
    });
    conn.release();
    });

});
//start server
var server = app.listen(8000, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
});



