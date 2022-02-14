const express = require('express');
const User = require("../models/User.model");
const router = express.Router();
const saltRounds = 5;
const bcrypt = require("bcrypt");


router.route('/signup', )
.get((req, res, next) => {
	res.render('signup');
})
.post((req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    res.render("signup", {errorMessage:"All fields are required"})
  }
  
  User.findOne({username})
  .then(user=>{
      if(user && user.username)
      {res.render("signup", {errorMessage: "User already taken!"})
      throw new Error ("Validation Error")}

      const salt = bcrypt.genSaltSync(saltRounds)
      const hashedPwd = bcrypt.hashSync(password, salt);

      User.create({username, password: hashedPwd})
      .then(()=>{
          res.redirect("/")
      })
  })
  .catch(()=>{
      res.redirect("/auth/signup")
  })

});


router.route("/login")
.get((req,res)=>{
   res.render("login");
})
.post((req, res)=>{
    const username = req.body.username
    const password = req.body.password;

    if(!username || !password){
		res.render("login", {errorMessage: "All fields are required"});
		throw new Error("Validation error")};
    
    User.findOne({username})
    .then(user=>{
        if(!user){
            res.render("login", {errorMessage: "Incorrect credentials"});
            throw new Error ("Validation error")
        }

        const isPwdCorrect = bcrypt.compareSync(password, user.password)
        if(isPwdCorrect){
            req.session.currentUserId = user._id;
            res.redirect("/auth/main")
        }else{
            res.render("login", {errorMessage: "Incorrect credentials"})
        }
    })
    .catch((err)=> {
		console.log(err)
	})

});


router.get("/main", (req, res) => {
	const id = req.session.currentUserId;
	User.findById(id)
	.then((user=>{
        res.render("main", user)}))
	.catch(err=>console.log(err))
});

router.get("/private", (req, res) => {
	const id = req.session.currentUserId;
	User.findById(id)
	.then((user=>{
        res.render("private", user)}))
	.catch(err=>console.log(err))
});



module.exports = router;