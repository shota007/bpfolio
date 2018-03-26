var express = require("express");
var router  = express.Router();
var photo = require("../models/photo");
var middleware = require("../middleware");


//INDEX - show all photos
router.get("/", function(req, res){
    // Get all photos from DB
    photo.find({}, function(err, allphotos){
       if(err){
           console.log(err);
       } else {
          res.render("photos/index",{photos:allphotos});
       }
    });
});

//CREATE - add new photo to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to photos array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newphoto = {name: name, image: image, description: desc, author:author}
    // Create a new photo and save to DB
    photo.create(newphoto, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to photos page
            console.log(newlyCreated);
            res.redirect("/photos");
        }
    });
});

//NEW - show form to create new photo
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("photos/new"); 
});

// SHOW - shows more info about one photo
router.get("/:id", function(req, res){
    //find the photo with provided ID
    photo.findById(req.params.id).populate("comments").exec(function(err, foundphoto){
        if(err){
            console.log(err);
        } else {
            console.log(foundphoto)
            //render show template with that photo
            res.render("photos/show", {photo: foundphoto});
        }
    });
});

// EDIT photo ROUTE
router.get("/:id/edit", middleware.checkphotoOwnership, function(req, res){
    photo.findById(req.params.id, function(err, foundphoto){
        res.render("photos/edit", {photo: foundphoto});
    });
});

// UPDATE photo ROUTE
router.put("/:id",middleware.checkphotoOwnership, function(req, res){
    // find and update the correct photo
    photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedphoto){
       if(err){
           res.redirect("/photos");
       } else {
           //redirect somewhere(show page)
           res.redirect("/photos/" + req.params.id);
       }
    });
});

// DESTROY photo ROUTE
router.delete("/:id",middleware.checkphotoOwnership, function(req, res){
   photo.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/photos");
      } else {
          res.redirect("/photos");
      }
   });
});


module.exports = router;

