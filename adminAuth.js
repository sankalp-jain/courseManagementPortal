//Initializing stuff
var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', './views');
app.set("view engine", "pug");

//Global variables
var courseName = [];
var courseId = [];
var courseEndTime = [];
var noOfStudents = [];
var courseStatus = [];
var studentList = {};
var studentInfo = {};
var regNo;

//Admin - username : admin       password: root

//Basic Flow of app, signUps and Logins

app.get("/", function(req, res){
	res.render("home");
})

app.get("/adminLogin", function(req, res){
	res.render("adminLogin");
})


app.post("/adminLogin", function(req, res){
	if(req.body.uname == 'admin' && req.body.pwd == "root"){
		res.redirect('/adminHome');
	}
	else{
		res.status(404).send('Error');
	}
});

//Student Login

app.get("/studentLogin", function(req, res){
	res.render("studentLogin");
})


app.post("/studentLogin", function(req, res){
	var name = req.body.studname;
	var pwd = req.body.pwd;

	if(studentList[name] == pwd){
		res.redirect("studentDetails");
	}
	else
		res.status(404).send("Error");
});

app.post("/studentDetails", function(req, res){
	name = regNo;
	var details = studentInfo[name];
	console.log(courseName.toString());
	res.render("studentDetails", {"studName" : details.name, "regNo" : name, "email" : details.email, "courses" : courseName});
})

//Student signup

app.get("/studentSignUp", function(req, res){
	res.render("studentSignUp");
})


app.post("/studentSignUp", function(req, res){
	regNo = req.body.studName;
	studentList[req.body.studName] = req.body.pwd;
	res.redirect("FillDetails");
});

app.get('/FillDetails', function(req, res){
	res.render('fillDetails' , {"reg" : regNo});
})

app.post('/FillDetails', function(req, res){
	var info = {"name" : req.body.Name, "email" : req.body.email, "courseEnrolled" : []};
	studentInfo[regNo] = info;
	res.redirect("studentLogin");
})

//EnrUnerDetails
app.get('/enrUnerDetails', function(req, res){
	res.send(req.body);
})

//Admin Jobs

app.get('/adminHome', function(req, res){
	res.render('adminResp');
})


//Just admin stuff (create, edit, delete, add students, delete students)
//Create a course
app.get('/addCourse', function(req, res){
	res.render('addCoursePage');
})

app.post('/addCourse', function(req, res){
	courseName.push(req.body.course);
	courseId.push(req.body.courseId);
	
	res.redirect('/addCourseConfirmation');
})

app.get('/addCourseConfirmation', function(req, res){
	res.send("Course added successfully");
})

//edit course

app.get('/editCourse', function(req, res){
	var cname = courseName.toString();
	var cid = courseId.toString();
	res.render('editCourses', {"cname" : cname, "cid" : cid});
})

app.post('/editCourse', function(req, res){
	var editCourseName = req.body.editCourse;
	var courseIndex = courseName.indexOf(editCourseName); 
	courseId[courseIndex] = req.body.editCourseId;

	res.redirect('editCourseConfirmation')
})

app.get('/editCourseConfirmation', function(req, res){
	res.send("Course Info Updated");
})

// delete course
app.get('/deleteCourse', function(req, res){
	var cname = courseName.toString();
	var cid = courseId.toString();
	res.render("deleteCourses", {"cname" : cname, "cid" : cid});
})

app.post('/deleteCourse', function(req, res){
	var deleteCourseName = req.body.deleteCourse;
	var courseIndex = courseName.indexOf(deleteCourseName); 

	if(courseId[courseIndex] == req.body.deleteCourseId){
		courseName.slice(courseIndex, 1);
		courseId.slice(courseIndex, 1);
		res.redirect('deleteCourseConfirmation')
	}
	else
		res.status(404).send("Error");
})

app.get('/deleteCourseConfirmation', function(req, res){
	res.send("Course Deleted");
})


app.listen(3000);