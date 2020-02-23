const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//List all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds
            });
        }
    });
});

//Form for new campgrounds
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//post route for new campgrounds
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            req.flash(
                "error",
                "Unable to create new campground. Please try again."
            );
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//Show more info on campgrounds
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCampground) => {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", { campground: foundCampground });
            }
        });
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    });
});

//Update route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        (err, updatedCampground) => {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        }
    );
});

//destroy update route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
