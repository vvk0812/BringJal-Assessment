var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    capacity: { 
        type: Number, 
        required: true
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
},
    { timestamps: true }
  );

var Inventorydata = new mongoose.model('Inventory', schema);
module.exports = Inventorydata;