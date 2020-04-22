const express=require('express');
const router=express.Router({mergeParams:true});
const Campground=require('../models/Campground');
const Comment =require('../models/Comment');
const middleware=require('../middlewares/index');



router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,(req,res) => {
	Campground.findById(req.params.id,(err,foundCampground) => {
		if(err) req.flash('error',err.message);
		else{
			res.render("comments/new" ,{campground:foundCampground});
		}
	});
});

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,(req,res) => {
	Campground.findById(req.params.id,(err,foundCampground) => {
		if(err) console.log("something went wrong!");
		else{
			Comment.create(req.body.comment,(err,newComment) => {
				if(err) console.log("something went wrong!");
			    else {
					newComment.author.id=req.user._id;
					newComment.author.username=req.user.username;
					newComment.save();
					foundCampground.comments.push(newComment);
					foundCampground.save();
					req.flash('success','Comment is added');
					res.redirect("/campgrounds/"+foundCampground._id);
				}
			});
		}
	});
});



// edit campground 

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwenership,async (req,res)=>{
	const foundComment=await Comment.findById(req.params.comment_id);
	res.render('comments/edit',{campground_id:req.params.id,comment:foundComment});
});

router.put('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwenership,async (req,res)=>{
	const updatedComment=await Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment);
	req.flash('success','Comment is updated');
	res.redirect('/campgrounds/'+req.params.id);
});

//  delete campground

router.delete('/campgrounds/:id/comments/:comment_id',middleware.checkCommentOwenership, async (req,res)=>{
	const deletedComment=await Comment.findByIdAndRemove(req.params.comment_id);
	req.flash('success','Comment is deleted');
	res.redirect('/campgrounds/'+req.params.id);
});


module.exports=router;
