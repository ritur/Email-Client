var express = require('express');
var router = express.Router();
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var nodeMailer = require('nodemailer');
var user = require('../models/UserSchema');
//To send mail for reset password
router.post('/sendemail', function (req, res, next) {
    console.log('the user mail is',req.body);
    var email_id = req.body.useremail.toLowerCase();
    let token;
    var user_email;
    //create a token for the user
    console.log('token getting..');
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');
    });
    
    console.log("toketn get");
    user.findOne({ 'email_id': email_id }, function (err, users) {              //
        if (!users) {
            console.log('user not found');
            res.send({ success: false, failed: 'user not found' });
        }
        else{

            users.resetPasswordToken = token;
            console.log("data in user");
            users.save(function (err, users) 
            {
                console.log("perfectly save");
                // Setup email data.
                //console.log("users::update::success " + JSON.stringify(data));
                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'info.practicenegotiation@gmail.com',
                        pass: '@@practice@@1'
                    }
                });
                let mailOptions = {
                    from: 'info.practicenegotiation@gmail.com', // sender address
                    to: users.email_id, // list of receivers
                    subject: 'TEST FOR FORGET PASSWORD', // Subject line
                    text: 'TESTED', // plain text body
                    html: '<b>Dear User,</b>' + '<br/>' + '<br/>' +
                        'You have requested a password reset, please follow the link below to reset your password.' + '<br/>' +
                        'Please ignore this email if you did not request a password change.' + '<br/>' +
                        'Follow this link to reset your password.' + '<br/>' + '<br/>' +
                        'http://localhost:3000/resetpassword/' + token
                };
                console.log(mailOptions);
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s');
                    //res.render('index');
                });
                res.send({ success: true, message: 'mail sended'});
            });
        }
    });
});

/* SAVE BOOK */
router.post('/resetPassword', function (req, res, next) {
    user.findOne({ 'resetPasswordToken': req.body.resetPasswordToken}, function (err, users) {
        if (users) 
        {
           
            bcrypt.hash(req.body.resetConPwd, null, null, function (err, encrPwd) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('en pwd is', encrPwd)
                    console.log('users all data', users);
                    console.log('users id is', users._id);

                    let updatedata = {
                        'conPassword': encrPwd,
                        'resetPasswordToken': undefined
                    }
                    user.findByIdAndUpdate(users._id, updatedata, function (err, post) {
                        if (err) {
                            console.log('error hai', err);
                        }
                        else {
                            console.log('error ni hai', post);
                            console.log('update');
                            let transporter = nodeMailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true,
                                auth: {
                                    user: 'info.practicenegotiation@gmail.com',
                                    pass: '@@practice@@1'
                                }
                            });
                            let mailOptions = {
                                from: 'info.practicenegotiation@gmail.com', // sender address
                                to: users.email_id, // list of receivers
                                subject: 'PASSWORD  CHANGED', // Subject line
                                text: 'TESTED', // plain text body
                                html: '<b>Dear User,</b>' + '<br/>' + '<br/>' +
                                    'This is a confirmation that the password for your account has just been changed.'
                            };
                            console.log(mailOptions);
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s');
                                //res.render('index');
                            });
                            res.send({ success: true, message: 'password reset now' });
                        }
                    });
                }
                
            });
            
        }
        else {
            console.log('token not found');
            res.send({ success: false, failed: 'not match' });
        }
    });
});

module.exports = router;
