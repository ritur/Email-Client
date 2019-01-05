var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    status: Number,
    email_id: String, //email_id as group name 
    groupMembers:{},
    receive_mail_type: { type: String, default: 'Group' },
    create_Date: String
});

module.exports = mongoose.model('groupColn', GroupSchema);
