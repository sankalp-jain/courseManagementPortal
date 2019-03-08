//Initializing stuff
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', './views');
app.set("view engine", "pug");

//Global variables
var courseName = {};
var courseNameDup = {};
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
	console.log(studentList);
	if(studentList[req.body.studname] == req.body.pwd){
		regNo = req.body.studname;
		console.log(regNo);
		res.redirect("studentDetails");
	}
	else
		res.status(404).send("Error");
});

app.get("/studentDetails", function(req, res){
	name = regNo;
	var details = studentInfo[name];
	res.render("studentDetails", {"studName" : details.name, "regNo" : name, "email" : details.email, "courses" : courseName, "coursesEnrolled" : details.courseEnrolled});
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

//Generate Report
app.get('/genReport', function(req, res){
	var det = studentInfo[regNo];
	res.send(det);
})

//EnrUnerDetails
app.get('/enrUnerDetails', function(req, res){
	console.log(req.query);
	var enrInfo = Object.keys(req.query)[0];
	var str = enrInfo.split(":");
	console.log(enrInfo);
	console.log(str);
	if(str[0] == "enroll"){
		var c = str[1];
		console.log(courseName[c][2]);
		if(courseName[c][2] == "active"){
			courseNameDup[str[1]][0] += 1;
			courseNameDup[str[1]][1].push(regNo);
			console.log(studentInfo[regNo].courseEnrolled);
			studentInfo[regNo].courseEnrolled.push(c);
			console.log(courseNameDup);
			res.send("Enrolled")
		}
		else
			res.send("Please enroll yourself in active courses");
	} 
	else{

		var c = str[1];
		if(courseName[c][2] == "active"){

			var index = studentInfo[regNo].courseEnrolled.indexOf(c);
			if (index > -1) {
			  studentInfo[regNo].courseEnrolled.splice(index, 1);
			}

			courseNameDup[str[1]][0] -= 1;
			var index = courseNameDup[str[1]][1].indexOf(regNo);
			courseNameDup[str[1]][1].splice(index, 1);
			console.log(courseNameDup);

			res.send("Unenrolled");			
		}
		else
			res.send("You can't be unenrolled from inactive courses");

	}
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
	var courseArray = [];
	courseArray.push(req.body.courseId);
	courseArray.push(req.body.endTime);
	courseArray.push(req.body.status);

	var courseArray2 = [];
	courseArray2.push(0);
	courseArray2.push([]);
	courseName[req.body.course] = courseArray;
	courseNameDup[req.body.course] = courseArray2;
	res.redirect('/addCourseConfirmation');
})

app.get('/addCourseConfirmation', function(req, res){
	res.send("Course added successfully");
})

//edit course

app.get('/editCourse', function(req, res){

	res.render('editCourses', {"courses" : courseName});
})

app.post('/editCourse', function(req, res){
	var editCourseName = req.body.editCourse;
	courseName[editCourseName][0] = req.body.editCourseId;

	res.redirect('editCourseConfirmation')
})

app.get('/editCourseConfirmation', function(req, res){
	res.send("Course Info Updated");
})

// delete course
app.get('/deleteCourse', function(req, res){
	res.render("deleteCourses", {"courses" : courseName});
})

app.post('/deleteCourse', function(req, res){
	var deleteCourseName = req.body.deleteCourse;
	var courseIndex = courseName[deleteCourseName][0]; 

	if(courseName[deleteCourseName][0] == req.body.deleteCourseId){
		delete courseName[deleteCourseName];
		console.log(courseName);
		res.redirect('deleteCourseConfirmation')
	}
	else
		res.status(404).send("Error");
})

app.get('/deleteCourseConfirmation', function(req, res){
	res.send("Course Deleted");
})


app.listen(3000);