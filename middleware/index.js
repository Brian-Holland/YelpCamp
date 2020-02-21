const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {
    checkCampgroundOwnership: (req, res, next) => {
        //is user logged in?
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, foundCampground) => {
                if (err) {
                    req.flash(
                        "error",
                        "Error: Unable to retrieve requested data."
                    );
                    res.redirect("back");
                } else {
                    //does user own campground? equals method to compare from Mongoose
                    if (foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash(
                            "error",
                            "You do not have permission to do that!"
                        );
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    },
    checkCommentOwnership: (req, res, next) => {
        //is user logged in?
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err) {
                    req.flash(
                        "error",
                        "Error: Unable to retrieve requested data."
                    );
                    res.redirect("back");
                } else {
                    //does user own comment? equals method to compare from Mongoose
                    if (foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash(
                            "error",
                            "You do not have permission to do that!"
                        );
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    },
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    },
    isAdmin: (req, res, next) => {
        if (req.user.isAdmin) {
            next();
        } else {
            req.flash("error");
            res.redirect("back");
        }
    }
};

module.exports = middlewareObj;
