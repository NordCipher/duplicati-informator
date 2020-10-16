// User entry database model

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProductSchema = new Schema({
    username: String,
    IPaddress: String,
    jobstat: String,
    report: String,
    location:String,
    reportURL:String
})

module.exports = mongoose.model('userlist', ProductSchema)


