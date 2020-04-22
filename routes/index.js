const express=require('express');
const router =express.Router({mergeParams:true});
const User=require('../models/User');
const passport=require('passport');

router.get('/', (req, res) => {
	res.render('campground/landing');
});


router.get('/register',(req,res)=>{
	res.render('register');
});

//handle register logic

router.post('/register',(req,res)=>{
	let newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err) {
			req.flash('error',err.message);
			console.log(err);
			return res.redirect('/register');
		}
		
		// pass 3 arguments to the below function 
		// req ,res and a callback function
		// by using local strategy 
		
		passport.authenticate('local')(req,res,()=>{
			req.flash('success','You registered Successfully');
			res.redirect('/campgrounds');
		});
	});
});

router.get('/login',(req,res)=>{
	res.render('login');
});

router.post('/login',passport.authenticate('local',{
	     successRedirect:'/campgrounds',
	     failureRedirect:'/login',
	     failureFlash:'Please enter correct information',
	     successFlash:'welcome to campground'
    }),(req,res)=>{
});


//logout logic

router.get('/logout',isLoggedIn,(req,res)=>{
	req.logout();
	req.flash('success','LoggedOut Successfully');
	res.redirect('/campgrounds');
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports=router;