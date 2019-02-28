var express = require('express');
var app = express();
app.use(express.urlencoded({extended: true}));

app.set('views', './views');
app.set("view engine", "pug");

app.get("/", function(res, req){
	res.render("home");
})