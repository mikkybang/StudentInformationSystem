var express = require('express');
var bodyParser = require("body-parser")
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(__dirname + "/public"));
app.use('/static', express.static(__dirname + "/public/css"));
app.use('/static', express.static(__dirname + "/public/js"));


//mysql
var mysql = require('mysql');
var pool = mysql.createPool({
connectionLimit : 100, //focus it
host : 'bemdt0uqq-mysql.services.clever-cloud.com',
user : 'ulmkhf7ogmhhgqvp',
password : 'FFXF7xnN21GVpzO4Qpr',
database : 'bemdt0uqq',
port: 3306
});


//opening view
app.get('/', function(req,res){
	pool.getConnection(function(error,conn){
    var queryString = "CREATE TABLE IF NOT EXISTS student (studentID int PRIMARY KEY AUTO_INCREMENT, firstName VARCHAR(50),middleName VARCHAR(50),lastName VARCHAR(50),age VARCHAR(10),sex ENUM('male','female'),class VARCHAR(10));"
    conn.query(queryString,function(error,results){
    if(error)
    {
    throw error;
    }
    else
    {
    res.render('index');
    }
    });
    conn.release();
    });
});
	
//insert resource
app.post('/create', function(req,res){
    pool.getConnection(function(error,conn){
		if (error)
        return res.send(400);
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
	port = process.env.PORT || 1881;
var server = app.listen(port, function () {
var host = server.address().address
var ports = server.address().port
console.log("Example app listening at http://%s:%s", host, ports)
});







