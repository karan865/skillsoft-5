const jwt = require("jsonwebtoken");
const express = require('express');
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

const router = express.Router();
// const authenticate = require("../middleware/authenticate");


require('../db/conn');
const User = require('../models/user');


router.get("/services", authenticate, (req, res) => {
    console.log("Hello from the secret page");
    res.send(req.rootUser);
});


// Using Async Await Way 

router.post("/register", async (req, res) => {
    const { name,LastName, email, phone,  password, cpassword } = req.body
    
    const user = await User.findOne({ email: email });
    if (user) {
        console.log("email is already exists");
        res.status(422).json({ message: "Email already exists" });
    } else {
        if (name && LastName && email && phone && password && cpassword) {
            if (password === cpassword) {
                try {
                    const doc = new User({
                        name: name,
                        LastName:LastName,
                        email: email,
                        phone: phone,
                        password: password,
                        cpassword:cpassword
                    })
                    await doc.save()
                     console.log(`${user} user Registered successfully abc`);
                     // return userRegister;
                     // res.status(201).render('sigin');
                     res.status(201).json({ message: "User Registered successfully" });
                } catch (error) {
                    console.log("Unable to Register");
                    res.status(422).json({ message: "Unable to Register" });
                }
            }else{
                console.log("Password and Confirm Password doesn't match");
                res.status(424).json({ message: "Password and Confirm Password doesn't matched" });
            }
        } else {
            console.log("All fields are required");
            res.status(423).json({ message: "All fields are required" });
        }
    }
})



// const userRegistration = async (req, res) => {
//     const { name, email, password, password_confirmation, tc } = req.body
//     const user = await UserModel.findOne({ email: email })
//     if (user) {
//         res.send({ "status": "failed", "message": "Email already exists" })
//     } else {
//         if (name && email && password && password_confirmation && tc) {
//             if (password === password_confirmation) {
//                 try {
//                     const salt = await bcrypt.genSalt(10)
//                     const hashPassword = await bcrypt.hash(password, salt)
//                     const doc = new UserModel({
//                         name: name,
//                         email: email,
//                         password: hashPassword,
//                         tc: tc
//                     })
//                     await doc.save()
//                     const saved_user = await UserModel.findOne({ email: email })
//                     // Generate JWT Token
//                     const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
//                     res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
//                 } catch (error) {
//                     console.log(error)
//                     res.send({ "status": "failed", "message": "Unable to Register" })
//                 }
//             } else {
//                 res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
//             }
//         } else {
//             res.send({ "status": "failed", "message": "All fields are required" })
//         }
//     }











    // creating a signin route 
    router.post("/login", async (req, res) => {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "INvalid Login Details" });
            }

            const userLogin = await User.findOne({ email: email });

            console.log(userLogin);

            if (userLogin) {

                const isMatch = await bcrypt.compare(password, userLogin.password);

                let token = await userLogin.generateAuthToken();

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 2592000000),
                    httpOnly: true
                });


                if (isMatch) {
                    res.json({ message: "user signin successfully" });
                } else {
                    res.status(422).json({ error: "Invalid Login Details" });
                }

            } else {
                return res.status(404).json({ error: "INvalid Login Details" });
            }
        } catch (error) {
            console.log("our error " + error);
        }
    })

//API for Logout
    router.get("/logout", (req, res) => {
        res.clearCookie('jwtoken', { path: '/' });
    
        //* we need to send the res atleast else with will not work
        res.status(200).send("logout susscessful");
    });




    module.exports = router;




















// router.post("/register", async (req, res) => {

//     try {

//         // we will get the data from react form
//         const { name, email, phone, work, password, cpassword } = req.body;

//         // we will do validation
//         if (!name || !email || !phone || !work || !password || !cpassword) {
//             console.log(`eroro from the backend ${name}  ${password}  ${email}`);
//             return res.json({ error: "Plzz fill the data properly" });
//         }

//         // we need to check weather the user already exists or not
//         const userEmail = await User.findOne({ email: email });

//         if (userEmail) {
//             console.log("email is already exists");
//             return res.status(422).json({ error: "Email alredy exists" });
//         } else if (password != cpassword) {
//             console.log("password are not matching ");
//             return res.status(422).json({ error: "passwords are not matching" });
//         } else {
//             // creating a new documents to be stored
//             const user = new User({ name, email, phone, work, password, cpassword });

//             // saving the data to the database
//             const userRegister = await user.save();
//             console.log(`${user} user Registered successfully`);
//             // return userRegister;
//             // res.status(201).render('sigin');
//             res.status(201).json({ message: "User Registered successfully" });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })