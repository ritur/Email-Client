
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var users = require('../models/UserSchema');
var config = require('../config/main');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var Create_DateVar = require('../models/Create_Date.js');

const jwt = require('jsonwebtoken')

// for check jwt token
router.get('/checkSession/sessionGotted/:token', function (req, res, next) {
    let token = req.params.token;
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                res.send({ success: false, failed: 'not match' });
            } else {
                console.log('user data is');
                res.status(200).send({ users_details: decoded, message: "login user" });
                
            }
        });
    } else {
        console.log('not here');
        res.send({ success: false, failed: 'not match' });
    }
    
    
});


router.post('/login', function (req, res, next) {

    console.log('user details is', req.body);

    var sign_in_useremail = req.body.useremail;
    var findemail = { "email_id": sign_in_useremail.toLowerCase() };
    console.log(findemail);
    var password = { "conPassword": req.body.userpassword };
    var isAdmin = req.body.isAdmin;
    users.findOne(findemail, function (err, users_details) {
        //if (users.isAdmin == 1) { 
        if (users_details) {
            console.log('user gotted', users_details);
            bcrypt.compare(req.body.userpassword, users_details.conPassword, function (err, result) {

                if (err) {
                    res.send({ success: false, failed: 'not match' });
                }
                else {
                    console.log('error nhi hai', result);
                    if (result) {
                        
                        console.log('password match');
                        console.log('going to set session');

                        var token = jwt.sign(users_details.toJSON(), config.secret, {expiresIn: 7200 });
                        res.status(200).send({ auth: true, token: token, users_details: users_details, message: "Successfully login your account." });
                        
                        // res.status(200).json({
                        //     token: 'JWT ' + generateToken(users_details),
                        //     user: users_details,
                        //     message: "Successfully login your account."
                        // });
                    }
                    else {
                        console.log('password not match');
                        res.send({ success: false, failed: 'not match' });
                    }
                }
            })
        }
        else {
            console.log('user not found');
            res.send({ success: false, failed: 'not match' });
        }
        /*}
        else {
            console.log('You are not admin');
            res.send({ success: false, failed: 'not match' });
        }*/
    });
})


/****************FOR ADMIN REGISTER****************** */
/* SAVE BOOK */
// router.post('/login', function (req, res, next) {
//     console.log('form data is',req.body);
//     var sign_up_useremail = req.body.useremail;
//     var isAdmin = 1;
//     bcrypt.hash(req.body.userpassword, null, null, function (err, hash) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log('pwd is', hash);
//         }
//         var registerData = new users({
//             'isAdmin': isAdmin,
//             'email_id': sign_up_useremail,
//             'conPassword': hash,
//             'create_Date': Create_DateVar.create_Date
//         });

//         console.log('the register data is', registerData);
//         registerData.save( function (err, post) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 console.log('gootted', post)
//                 res.json(post);
//             }
//         });
//     });
// });

/* REGISTER */
router.post('/', function (req, res, next) {
    
    console.log('form data is', req.body);
    bcrypt.hash(req.body.conPassword, null, null, function (err, hash) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('pwd is', hash);
        }
        var registerData = new users({
            'status':req.body.status,
            'first_name': req.body.first_name,
            'last_name': req.body.last_name,
            'phone': req.body.phone,
            'role': req.body.role,
            'email_id': req.body.email_id,
            'conPassword': hash,
            'create_Date': Create_DateVar.create_Date
        });

        console.log('the register data is', registerData);
        registerData.save( function (err, post) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('gootted', post)
                res.json(post);
            }
        });
    });
});

/******** CHECK EMAIL EXIST OR NOT ******** */
router.post('/checkEmailId', function (req, res, next) {
    let userEmail = { email_id: req.body.inputEmail.toLowerCase() }
    users.findOne(userEmail, function (err, details) {
        if (err) {
            console.log("error occured", err);
            res.send({ success: false, failed: 'error occured' });
        }
        //if user found.
        else if (details) {
            console.log('EMAIL already exists');
            res.send({ success: false, failed: 'EMAIL already exists' });
        }
        else {
            console.log('Email available');
            res.send({ success: false, message: 'Email available' });
        }
    });
});

// /* LOGIN */
// router.post('/login', function (req, res, next) {
//     console.log('user details is', req.body);

//     var sign_in_useremail = req.body.useremail;
//     var findemail = { "email_id": sign_in_useremail.toLowerCase() };
//     console.log(findemail);
//     var password = { "conPassword": req.body.userpassword };
//     var isAdmin = req.body.isAdmin;
//     users.findOne(findemail, function (err, users) {
//         //if (users.isAdmin == 1) { 
//             if (users) {
//                 console.log('user gotted', users);
//                 bcrypt.compare(req.body.userpassword, users.conPassword, function (err, result) {
                    
//                     if(err)
//                     {
//                         res.send({ success: false, failed: 'not match' });
//                     }
//                     else{
//                         console.log('error nhi hai', result);
//                         if (result) 
//                         {
//                             console.log('password match');
//                             console.log('going to set session');
//                             req.session.users = users;
//                             console.log('sesion set now', req.session.users);
//                             res.send({ success: true, message: 'Loaded fruits', 'usersdata': users });
//                         }
//                         else 
//                         {
//                             console.log('password not match');
//                             res.send({ success: false, failed: 'not match' });
//                         }
//                     }
//                 })
//             }
//             else {
//                 console.log('user not found');
//                 res.send({ success: false, failed: 'not match' });
//             }
//         /*}
//         else {
//             console.log('You are not admin');
//             res.send({ success: false, failed: 'not match' });
//         }*/
//     });
// });

// router.get('/checkSession/sessionGotted', function (req, res, next) {
//     console.log('api called');

//     // let responceAdmin = req.session.users;
//     // res.send({ sessionData: responceAdmin });
//     let responceAdmin = {
//         "email_id": "vipul.webnexus@gmail.com",
//         "isAdmin": 1,
//         "_id": "5bd3f51efe5d700920c3175b",
//         "conPassword": "$2a$10$WNbCrRHnLZ.IOX/sVnqoauGu9SMQcLG4NNXzbB9kiNpZYmraZeI2O",
//         "create_Date": "27 October 2018"
//     }
//     if (!responceAdmin == '') {
//         console.log('session avl');
//         res.send({ sessionData: responceAdmin });
//     }
//     else if (responceAdmin == '') {
//         console.log('session avl not');
//         res.send({ success: false, failed: 'not match' });
//     }
//     else {
//         console.log('session avl not');
//         res.send({ success: false, failed: 'not match' });
//     }
// });


router.post('/checkSession/logout', function (req, res, next) {
    
    console.log('logout api calleds');
    if (req.session.destroy()) {
        res.send({ sessionData: 'good' });
    }
    else {
        res.send({ success: false, failed: 'not match' });
    }

});

/* GET ALL BOOKS */
router.get('/', function (req, res, next) {
    users.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});
/* GET ALL BOOKS */
router.get('/getSelectedUserFields', function (req, res, next) {
    console.log('getSelectedUserFields api called')
    users.find({}, {first_name:1,seen: 1, receive_mail_type: 1, email_id: 1,_id: 1},function (err, products) {
        if (err) return next(err); 
        res.json(products);
    });
});
/* GET ALL BOOKS */
router.get('/getSelectedUserFields/:id', function (req, res, next) {
    console.log('getSelectedUserFields api called', req.params.id)
    users.findById({_id:req.params.id}, { first_name: 1, seen: 1, receive_mail_type: 1, email_id: 1, _id: 1 }, function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET ALL BOOKS */
router.get('/getSelectedUserFieldsForGroup', function (req, res, next) {
    console.log('getSelectedUserFieldsForGroup api called')
    users.find({}, { first_name:1,email_id: 1, _id: 1 }, function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET ALL BOOKS */
router.get('/getSelectedUserFieldsForRequestDoc', function (req, res, next) {
    console.log('getSelectedUserFieldsForRequestDoc api called')
    users.find({}, { seen:1,first_name: 1, email_id: 1, _id: 1 }, function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function (req, res, next) {
    users.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE BOOK */
router.put('/:id', function (req, res, next) {
    users.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE BOOK */
router.delete('/:id', function (req, res, next) {
    users.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


module.exports = router;
