const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/Campground');
const methodOverride = require('method-override');
const middleware = require('../middlewares/index');

router.get('/campgrounds', (req, res) => {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			req.flash('error', err.message);
			console.log(err);
		} else {
			res.render('campground/index', { campgrounds: allCampgrounds });
		}
	});
});

router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
	var name = req.body.campgroundName;
	var imageUrl = req.body.imageUrl;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = { name: name, image: imageUrl, description: description, author: author };

	Campground.create(newCampground, (err, campground) => {
		if (err) {
			req.flash('error', err.message);
			return handleError(err);
		} else {
			req.flash('success', 'Welcome ' + campground.author.username);
			res.redirect('/campgrounds');
		}
	});
});

router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => {
	res.render('campground/new');
});

router.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, foundCampground) => {
			if (err) {
				req.flash('error', err.message);
				console.log('something went wrond!');
			} else {
				res.render('campground/show', { campground: foundCampground });
			}
		});
});

// edit campground

router.get('/campgrounds/:id/edit', middleware.checkUserOwenership, async (req, res) => {
	const foundCampground = await Campground.findById(req.params.id);
	res.render('campground/edit', { campground: foundCampground });
});

router.put('/campgrounds/:id', middleware.checkUserOwenership, async (req, res) => {
	const updatedCampground = await Campground.findByIdAndUpdate(
		req.params.id,
		req.body.campground
	);
	req.flash('success', 'Successfully updated ' + updatedCampground.name);
	res.redirect('/campgrounds/' + req.params.id);
});

//  delete campground

router.delete('/campgrounds/:id', middleware.checkUserOwenership, async (req, res) => {
	const deletedCampground = await Campground.findByIdAndRemove(req.params.id);
	req.flash('success', 'Successfully deleted ' + deletedCampground.name);
	res.redirect('/campgrounds');
});

module.exports = router;