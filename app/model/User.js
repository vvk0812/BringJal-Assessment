var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
         type: String, 
         required: true 
        },
    mobile: { 
        type: String, 
        required: true, 
        unique: true 
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    createdAt: { 
        type: String,
        require: true 
    }, // Stores date in day/month/year format as string
  });

var Userdata = new mongoose.model('User', schema);
module.exports = Userdata;