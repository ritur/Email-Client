var mongoose = require('mongoose');

var EmailsSchema = new mongoose.Schema({
    to: {},
    froms: {},
    subject: String,
    mail_type:String,
    message: String,
    create_Date: String,
    updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Emails', EmailsSchema);
