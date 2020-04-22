const Campground=require('../models/Campground'),
	  Comment   =require('../models/Comment');

const middleWare ={};

middleWare.checkUserOwenership=async (req,res,next)=>{
	if(req.isAuthenticated()){
		const foundCampground=await Campground.findById(req.params.id);
		if(foundCampground.author.id.equals(req.user._id)){
			next();
		}		
        else{
			req.flash('error','Access denied');
		    res.redirect('back');
		}
	}
	else {
		req.flash('error','you need to be login first');
		res.redirect('back');
	}
}

middleWare.checkCommentOwenership=async (req,res,next)=>{
	if(req.isAuthenticated()){
		const foundComment=await Comment.findById(req.params.comment_id);
		if(foundComment.author.id.equals(req.user._id)){
			next();
		}
		else{
			req.flash('error','Access denied');
		    res.redirect('back');
		}
	}
	else {
		req.flash('error','you need to be login first');
		res.redirect('back');
	}
}

middleWare.isLoggedIn=(req,res,next)=>{
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error','you need to be login first');
	res.redirect('/login');
}

module.exports=middleWare;


