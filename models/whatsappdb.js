const mongoose = require('mongoose');

const whatasappSchema = mongoose.Schema({
    message : String,
    name : String,
    timestamp : String,
    received : Boolean
});

module.exports = message = mongoose.model('message' , whatasappSchema)