
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
var fs = require('fs');
var EmailsSchema = require('../models/ComposeMailSchema.js');
var Create_DateVar = require('../models/Create_Date.js');
const crypto = require("crypto");
/* GET ALL BOOKS */
router.get('/', function (req, res, next) {
    EmailsSchema.find(function (err, products) {
        if (err) return next(err);
        console.log('all mails', products)
        res.json(products);
    });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function (req, res, next) {
    
    EmailsSchema.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

function generateId()
{
    const id = crypto.randomBytes(16).toString("hex");
    return id;
}

/* SAVE BOOK */
router.post('/', function (req, res, next) {
    let resIId = generateId()
    var time = new Date();
    var create_TimeVar = time.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', hour12: true })
    
    if(req.body.isRequestMail === 1){
        var finalParams = new EmailsSchema({
            'isRequestMail':req.body.isRequestMail,
            'subject': req.body.subject,
            'mail_type': req.body.mail_type,
            'users_union': req.body.to,
            'emails':[{
                        'id':resIId,
                        'to':req.body.to,
                        'froms': req.body.froms,
                        'message':req.body.documentName,
                        'create_Date':Create_DateVar.create_Date,
                        'create_Time':create_TimeVar,
                        'updated_Date':new Date()
                    }],
            'create_Date': Create_DateVar.create_Date,
            'updated_Date': new Date()
        }); 
    }
    else if (req.body.isRequestMailReply === 1){
        var finalParams = new EmailsSchema({
            'isRequestMailReply': req.body.isRequestMailReply,
            'subject': req.body.subject,
            'mail_type': req.body.mail_type,
            'users_union': req.body.to,
            'emails': [{
                'id': resIId,
                'to': req.body.to,
                'froms': req.body.froms,
                'docName': req.body.docName,
                'create_Date': Create_DateVar.create_Date,
                'create_Time': create_TimeVar,
                'updated_Date': new Date()
            }],
            'create_Date': Create_DateVar.create_Date,
            'updated_Date': new Date()
        });
    }
    else
    {
        var finalParams = new EmailsSchema({
            'total_emails':1,
            'subject': req.body.subject,
            'mail_type': req.body.mail_type,
            'users_union': req.body.to,
            'emails':[{
                        'id':resIId,
                        'to':req.body.to,
                        'cc':req.body.cc,
                        'bcc':req.body.bcc,
                        'froms': req.body.froms,
                        'message':req.body.message,
                        'create_Date':Create_DateVar.create_Date,
                        'create_Time':create_TimeVar,
                        'updated_Date':new Date()
                    }],
            'create_Date': Create_DateVar.create_Date,
            'updated_Date': new Date()
        });
    }

    // var finalParams = new EmailsSchema({
    //     "total_emails" : 1,
    //     "subject" : "test seen",
    //     "mail_type" : "very_important",
    //     "users_union" :
    //         [
    //             {
    //                 "seen": 1,
    //                 "receive_mail_type": "Direct",
    //                 "_id": "5c0e355d51a9e62c1459d690",
    //                 "first_name": "admin",
    //                 "email_id": "admin@gmail.com"
    //             },
    //             {
    //                 "seen": 1,
    //                 "receive_mail_type": "Direct",
    //                 "_id": "5c0e359851a9e62c1459d692",
    //                 "first_name": "sunil",
    //                 "email_id": "sunil@gmail.com"
    //             }
    //         ],
    //     "emails" : 
    //         [{
    //             "id" : "100",
    //             "to" : [
    //                 {
    //                     "seen": 0,
    //                     "receive_mail_type": "Direct",
    //                     "_id": "5c0e355d51a9e62c1459d690",
    //                     "first_name": "admin",
    //                     "email_id": "admin@gmail.com"
    //                 }
    //             ],
    //                 "cc" : [],
    //                 "bcc" : [],
    //                 "froms" : {
    //                             "id" : "5c0e359851a9e62c1459d692",
    //                             "username" : "sunil",
    //                             "email_id" : "s@gmail.com"
    //                         },
    //                 "message" : "<p>1</p>",
    //                 "create_Date" : "Dec 19 2018",
    //                 "create_Time" : "10:53 AM",
    //                 "emails":[{
    //                             "id": "200",
    //                             "parent_id":"100",
    //                             "to": [
    //                                 {
    //                                     "seen": 0,
    //                                     "receive_mail_type": "Direct",
    //                                     "_id": "5c0e359851a9e62c1459d692",
    //                                     "first_name": "sunil",
    //                                     "email_id": "sunil@gmail.com"
    //                                 }
    //                             ],
    //                             "cc": [],
    //                             "bcc": [],
    //                             "froms": {
    //                                 "id": "5c0e355d51a9e62c1459d690",
    //                                 "username": "admin",
    //                                 "email_id": "admin@gmail.com"
    //                             },
    //                             "message": "<p>1.1</p>",
    //                             "create_Date": "Dec 19 2018",
    //                             "create_Time": "10:53 AM"
    //                         }]
    //         }],
       
    // });

    console.log('compose data arerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', finalParams);
    EmailsSchema.create(finalParams, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE BOOK */
router.put('/changeSeenStatus/:email_id', function (req, res, next) {
    let email_id = req.params.email_id,
        myid = req.body.myid,
        seen = req.body.seen
    EmailsSchema.updateOne({ _id: email_id, "users_union": { "$elemMatch": { "_id": myid} } }, { $set: { "users_union.$.seen": 1 } }, { multi: true }, function (err, post) {
        if (err)
        console.log(err);
        return next(err);
        console.log(post);
        res.json(post);
    });
});

/* UPDATE BOOK */
router.put('/:id', function (req, res, next) {
    EmailsSchema.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


/* UPDATE BOOK */
router.put('/replyApi/:root_id', function (req, res, next) {
    console.log('reply function called');
    var time = new Date();
    var create_TimeVar = time.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', hour12: true })

    let getRamdom_id = generateId();
    let root_id =  req.params.root_id;
    let body_data = req.body;
    let parent_id = req.body.parent_id;
    let emails = [];
    emails.push({
        "id": getRamdom_id,
        "to": req.body.to,
        'froms': req.body.froms,
        'message': req.body.message,
        'create_Date': Create_DateVar.create_Date,
        'create_Time': create_TimeVar,
        'updated_Date': new Date()

    })  

    let emails1 = {
        "id": getRamdom_id,
        "to": req.body.to,
        'froms': req.body.froms,
        'message': req.body.message,
        'create_Date': Create_DateVar.create_Date,
        'create_Time': create_TimeVar,
        'updated_Date': new Date()
    }
    console.log('the emails isssssssssssssssssssssssssssss',emails);
    EmailsSchema.findOne({ "_id": root_id }, function (err, results) {
        if (err) {
            return next(err)
        }
        else 
        {
            let tempParams = results
            
            rescursionEx(tempParams);  
           
            function rescursionEx(resData) {
                var i = 0;
                var is_email_exists = 0;
                if (resData.emails == null) {
                    return 0;
                }
                if (resData.emails.length == 0) {
                    return 0;
                }
                for (i = 0; i < resData.emails.length; i++) {
                    // console.log('the res data issssssssss', resData.emails[i].message);
                    if (resData.emails[i].id == parent_id) {
                        if (!resData.emails[i].emails) {
                            resData.emails[i].emails = emails;
                        }
                        else {
                            var jsonStr = resData.emails[i];
                            var obj = jsonStr;
                            obj['emails'].push(emails1);
                            jsonStr = JSON.stringify(obj);
                        }
                    }
                    rescursionEx(resData.emails[i]);
                }
            } 
            console.log('going to show result')

            EmailsSchema.updateOne({ _id: root_id}, tempParams, function (err,post) {
                if(err){
                    console.log(err)
                }
                else{
                     
                    console.log('good');
                    console.log(post)
                }
            })
          
        }
    });
});



/* DELETE BOOK */
router.delete('/:id', function (req, res, next) {
    EmailsSchema.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/*for inbox show all mail according to users*/
router.get('/findMail/:myid', function (req, res, next) {
    let veryTemp = [];
    let impTemp = [];
    let norTemp = [];
    // EmailsSchema.aggregate([
    //     //{ "$match": { "emails.to._id": { "$in": [req.params.myid] } } },
    //     {
    //         "$match": {
    //             "$and": [
    //                 {
    //                     "emails.to._id": {
    //                         "$in": [req.params.myid]
    //                     }
    //                 },
    //                 {
    //                     "mail_type": {
    //                         "$in": ["very_important"]
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         "$project": {
    //             "_id":1,
    //             "subject":1,
    //             "mail_type": 1,
    //             "emails":1,
    //             "users_union":1,
    //             "weight": {
    //                 "$filter": {
    //                     "input": "$users_union",
    //                     "as": "users_deta",
    //                     "cond": { "$eq": ["$$users_deta.seen", 0], "$eq": ["$$users_deta.seen", 1], "$eq": ["$mail_type", "very_important"] }
    //                 }
    //             }
                
    //         }
    //     },
    //     { "$sort": { "weight": 1, 'emails.updated_Date': -1 } },
    //     // {
    //     //     "$limit": 5
    //     // },
    // ]).exec(function (err, model) {
    //     if (err) {

    //         console.log(err);
    //     }
    //     else 
    //     {
             
    //         veryTemp = model 
            
    //     }
    // });

    // EmailsSchema.aggregate([
    //     //{ "$match": { "emails.to._id": { "$in": [req.params.myid] } } },
    //     {
    //         "$match": {
    //             "$and": [
    //                 {
    //                     "emails.to._id": {
    //                         "$in": [req.params.myid]
    //                     }
    //                 },
    //                 {
    //                     "mail_type": {
    //                         "$in": ["important"]
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         "$project": {
    //             "_id": 1,
    //             "subject": 1,
    //             "mail_type": 1,
    //             "emails": 1,
    //             "users_union": 1,
    //             "weight": {
    //                 "$filter": {
    //                     "input": "$users_union",
    //                     "as": "users_deta",
    //                     "cond": { "$eq": ["$$users_deta.seen", 0], "$eq": ["$$users_deta.seen", 1], "$eq": ["$mail_type", "important"] }
    //                 }
    //             }

    //         }
    //     },
    //     { "$sort": { "weight": 1, 'emails.updated_Date': -1 } },
    //     // {
    //     //     "$limit": 5
    //     // },
    // ]).exec(function (err, model) {
    //     if (err) {

    //         console.log(err);
    //     }
    //     else {
             
    //         impTemp = model
             
    //     }
    // });

    // EmailsSchema.aggregate([
    //     //{ "$match": { "emails.to._id": { "$in": [req.params.myid] } } },
    //     {
    //         "$match": {
    //             "$and": [
    //                 {
    //                     "emails.to._id": {
    //                         "$in": [req.params.myid]
    //                     }
    //                 },
    //                 {
    //                     "mail_type": {
    //                         "$in": ["normal"]
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         "$project": {
    //             "_id": 1,
    //             "subject": 1,
    //             "mail_type": 1,
    //             "emails": 1,
    //             "users_union": 1,
    //             "weight": {
    //                 "$filter": {
    //                     "input": "$users_union",
    //                     "as": "users_deta",
    //                     "cond": { "$eq": ["$$users_deta.seen", 0], "$eq": ["$$users_deta.seen", 1], "$eq": ["$mail_type", "normal"] }
    //                 }
    //             }

    //         }
    //     },
    //     { "$sort": { "weight": 1, 'emails.updated_Date': -1 } },
    //     // {
    //     //     "$limit": 5
    //     // },
    // ]).exec(function (err, model) {
    //     if (err) {

    //         console.log(err);
    //     }
    //     else {
             
    //         norTemp = model;
    //         let finalDatas = veryTemp.concat(impTemp, norTemp);
    //         let tempVar = finalDatas.concat(norTemp);
    //         console.log('the final data isssssssssssssssssssssssssssssssssss veryTemp ', finalDatas);
    //         res.json(finalDatas);
    //     }
    // });

    EmailsSchema.aggregate([
        { "$match": { "emails.to._id": { "$in": [req.params.myid] } } },
        {
            "$project": {
                "_id":1,
                "status":1,
                "subject":1,
                "mail_type": 1,
                "emails":1,
                "users_union":1,
                "weight": {
                    "$cond": [
                        { "$eq": ["$mail_type", "very_important"] },
                        10,
                        {
                            "$cond": [
                                { "$eq": ["$mail_type", "important"] },
                                5,
                                0            
                            ]
                        }
                    ]
                }
            }
        },
        { "$sort": { "weight": -1, 'emails.updated_Date': -1 } },
        // {
        //     "$limit": 5
        // },
    ]).exec(function (err, model) {
        if (err) {

            console.log(err);
        }
        else 
        {
            console.log('the final data is', model);
            res.json(model);
        }
    });

    // EmailsSchema.find({ 'emails.to': { $elemMatch: { _id: req.params.myid } } }).sort({ 'emails.updated_Date': -1 }).exec(function (err, model) {
    //     if (err) {

    //         console.log(err);
    //     }
    //     else {
    //         console.log('the final data is', model);
    //         res.json(model);
    //     }
    // });
});

/* show sended mails to users*/
router.get('/sendedMail/:myid', function (req, res, next) {
    console.log('api called for find sended mail', req.params.myid);
    EmailsSchema.find({ "emails.froms.id": req.params.myid }).sort({ 'emails.updated_Date': -1 }).exec( function (err, post) {
        if (err) {

            console.log(err);
        }
        else {
            console.log('the final data is for sended', post);
            res.json(post);
        }
    });
});

/* show requestedDocMails mails to users*/
router.get('/requestedDocMails/:myid', function (req, res, next) {
    console.log('api called for find requestedDocMails mail', req.params.myid);
    EmailsSchema.find({ $and: [{ "mail_type": "important", "isRequestMail": 1, 'emails.to': { $elemMatch: { _id: req.params.myid } } }] }).sort({ 'emails.updated_Date': -1 }).exec(function (err, post) {
        if (err) {

            console.log(err);
        }
        else {
            console.log('the final data is for requestedDocMails', post);
            res.json(post);
        }
    });
});

//******************************************** FOR Debriefing PDF UPLOAD *****************************

// Set The Storage Engine
const storageDefPdf = multer.diskStorage({
    destination: './public/uploads/DefPdf/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

// Init Upload
const uploaDefPdf = multer({
    storage: storageDefPdf,
    limits: { fileSize: 200 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        checkFileTypeDefPdf(file, cb);
    }
}).single('uploads');

// Check File Type
function checkFileTypeDefPdf(file, cb) {
 
    // Allowed ext 
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|xlsx/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    //const mimetype = filetypes.test(file.mimetype);

    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

router.post('/uploadRequestDoc', (req, res) => {
    console.log('api called');
    req.on('close', function () {
        console.log('closed');
    })

    uploaDefPdf(req, res, (err) => {
        if (err) {
            res.send(err);
            console.log('error');
        }
        else {
            if (req.file == undefined) {
                console.log('sorry');
                res.send('Sorry Dear there is an error for undefined');
            }
            else {
                console.log('file uploaded successful');
                res.send({ msg: 'File Uploaded', file: `${req.file.filename}` });
                //console.log('403 is',res.status(403));
                // res.render('index', {
                //   msg: 'File Uploaded!',
                //   file: `uploads/${req.file.filename}`
                // });
            }
        }
    });
});


router.get('/deleteRequestDoc/:file', function (req, res) {
    console.log('delete api call');
    let destination = './public/uploads/DefPdf/';
    var targetPath = destination + req.param("file");

    console.log(targetPath);
    fs.unlink(targetPath, function (err) {
        if (err) {
            console.log(err);
            res.send("Error to delete file: " + err);

        } else {
            console.log('delete');
            res.send("File deleted successfully!");

        }
    })
});


/****************************      FUNCTION FOR ARCHIVE **************************************/
router.post('/archiveMails', function (req, res, next) {
    let selected = req.body.selected;
    EmailsSchema.updateMany({ _id: { $in: selected } }, { $set: { status: 0 }  }, {multi: true}, function (err, results) {
            if (err) {
                console.log('error',err);
            } else {
                console.log('Record archive successfully!', results);
                res.send("Record archive successfully!");
            }
    });
});

/****************************      FUNCTION FOR MOVE TO INBOX **************************************/
router.post('/moveInboxMails', function (req, res, next) {
    let selected = req.body.selected;
    EmailsSchema.updateMany({ _id: { $in: selected } }, { $set: { status: 1 } }, { multi: true }, function (err, results) {
        if (err) {
            console.log('error', err);
        } else {
            console.log('Record move to inbox successfully!', results);
            res.send("Record move to inbox successfully!");
        }
    });
});

/****************************      FUNCTION FOR MARK AS READ MAILS **************************************/
router.post('/markReadMails', function (req, res, next) {
    let selected = req.body.selected;
    let myid = req.body.myid;
    EmailsSchema.updateMany({ _id: { $in: selected }, "users_union": { "$elemMatch": { "_id": myid } } }, { $set: { "users_union.$.seen": 1 } }, { multi: true }, function (err, post) {
        if (err) {
            console.log('error', err);
        } else {
            console.log('Record mark as read successfully!', post);
            res.send("Record mark as read  successfully!");
        }
    });
});

/****************************      FUNCTION FOR MARK AS UNREAD MAILS **************************************/
router.post('/markUnreadMails', function (req, res, next) {
    let selected = req.body.selected;
    let myid = req.body.myid;
    EmailsSchema.updateMany({ _id: { $in: selected }, "users_union": { "$elemMatch": { "_id": myid } } }, { $set: { "users_union.$.seen": 0 } }, { multi: true }, function (err, post) {
        if (err) {
            console.log('error', err);
        } else {
            console.log('Record mark as unread  successfully!', post);
            res.send("Record mark as unread  successfully!");
        }
    });
});

/****************************      FUNCTION FOR MARK AS UNREAD MAILS **************************************/
router.post('/markUnreadMails1', function (req, res, next) {
    let selected = req.body.selected;
    let myid = req.body.myid;
    EmailsSchema.updateMany({ _id: { $in: selected }, "users_union": { "$elemMatch": { "_id": myid } } }, { $set: { "users_union.$.seen": 0 } }, { multi: true }, function (err, post) {
        if (err) {
            console.log('error', err);
        } else {
            console.log('Record mark as unread  successfully!', post);
            res.send("Record mark as unread  successfully!");
        }
    });

    // Site.deleteMany({ userUID: uid, id: { $in: [10, 2, 3, 5] } }, function (err) { })

    // var collection = db.users;
    // var usersDelete = [];
    // var ObjectID = req.mongo.ObjectID;   //req is request from express

    // req.body.forEach(function (item) {     //req.body => [{'_id' : ".." , "name" : "john"}]
    //     usersDelete.push(new ObjectID(item._id));
    // });

    // collection.remove({ '_id': { '$in': usersDelete } }, function () {
    //     //res.json(contatos);
    // });
});


module.exports = router;
