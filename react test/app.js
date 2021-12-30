//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


// session package
app.use(session({
    secret: "little secret",
    resave:false,
    saveUninitialized:false
    
}));

app.use(passport.initialize());
app.use(passport.session());
//mongoose
mongoose.connect("mongodb://localhost:27017/reactTest", {useNewUrlParser:true});


const userSchema = new mongoose.Schema( {
    username : String,
    password: String
});

//use plugin hash and salt but not needed at the moment
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




    app.get("/", function(req, res){
        res.render("home")
    });
    app.get("/login", function(req, res){
        res.render("login")
    });
    app.get("/register", function(req, res){
        res.render("register")
    });
    
app.get("/welcome", function(req,res){
    if(req.isAuthenticated()){
        res.render("welcome");
    }else{
        res.redirect("/login")
    }
});

//logout

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})

    //catch regist 
app.post("/register", function(req,res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/welcome");
            });
        }
    });
    });








app.post("/login", function(req, res){
    const user = new User({
username : req.body.username,
password : req.body.password
    });

    req.login(user, function (err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req,res , function(){
                res.redirect("/welcome");
            })
        }
    })
});





app.listen(3000,function(){
    console.log("server 3000 is running!");
    })

