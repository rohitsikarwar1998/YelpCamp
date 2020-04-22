//== require mandatory packages into our file 

const express 			     =require('express');
const app       			 =express();
const bodyParser 		     =require('body-parser');
const mongoose				 =require('mongoose');
const flash                  =require('connect-flash');
const passport               =require('passport');
const methodOverride         =require('method-override');
const LocalStrategy          =require('passport-local');
const passportLocalMongoose  =require('passport-local-mongoose');

// require routes

const indexRoutes     =require('./routes/index'),
	  commentRoutes   =require('./routes/comment'),
	  campgroundRoutes=require('./routes/campground');

//  require models

const Campground=require("./models/Campground"),
      Comment   =require("./models/Comment"),
      User      =require('./models/User'),
      seedDB    =require("./seeds");

mongoose.connect('mongodb://localhost/yelp_camp', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// seedDB();  // we use this function for testing purpose

//   PASSWORD  CONFIGURATION 

app.use(require('express-session')({
	secret:'this is my secret code',
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
 
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash('success');
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3000, () => {
	console.log('campground server is running');
});