// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    status: { type: Number, default: 1},
    login_status: { type: Number, default: 1 },
    first_name: String,
    last_name: String,
    phone: String,
    role: String,
    email_id: { type: String,lowercase: true },
    conPassword: { type: String},
    resetPasswordToken: { type: String },
    isAdmin: { type: Number, default: 0 },
    seen: { type: Number, default: 0 },
    receive_mail_type: { type: String, default: 'Direct' },
    create_Date: String
},
    {
        versionKey: false
    }
);

userSchema.statics.findByName = function (username, cb) {
    return this.find({ username: username }, cb);
};

// the schema is useless so far
// we need to create a model using it
var adminSchema = mongoose.model('usersCredential', userSchema);

// make this available to our users in our Node applications
module.exports = adminSchema;