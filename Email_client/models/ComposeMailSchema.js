var mongoose = require('mongoose');

var ComposeMailSchema = new mongoose.Schema({
    status: { type: Number, default: 1 },
    total_emails: Number,
    isRequestMail:{type:Number,default:0},
    isRequestMailReply:{ type: Number, default: 0 },
    subject: String,
    mail_type: String,
    users_union: {},
    emails: {},
    create_Time:String,
    updated_Date:{type: Date, default:Date.now}

});
module.exports = mongoose.model('Emails', ComposeMailSchema);
