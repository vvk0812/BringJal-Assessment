
const Inventory = require("../model/inventory")
const User = require('../model/User');
const axios = require('axios');


exports.Creatinventory = async (req, res) => {
    try {
      const { name,capacity,coordinates } = req.body;
      const { latitude, longitude } = coordinates || {};
  
      if (!name || !capacity ||!coordinates) {
        return res.status(400).json({ Status: false, message: 'Please Fill All The Fields' });
      }
     const Inventorydata = new Inventory({
        name,
        capacity,
        coordinates: { latitude, longitude },
    });
       await Inventorydata.save();
      console.log(Inventorydata);
      return res.status(201).json({Status: true,message: 'Inventory Created Successfully',Inventorydata});
  } catch (err) {
      console.error(err);
      return res.status(500).json({ Status: false, message: 'Something went wrong' });
    }
  };

exports.Updateinventory = async (req, res) => {
    try {
        const { inventory_id,name,capacity,coordinates } = req.body;
        const { latitude, longitude } = coordinates || {};
  
        const inventorydata = await Inventory.findByIdAndUpdate({ _id:inventory_id},{ $set: {name:name,capacity:capacity,coordinates:{ latitude, longitude }}},{ new: true });
        if (!inventorydata) {
            res.status(404).send({ message: `Inventory Data Not Found.` });
           } else {
          return res.status(200).send({ Status: true, message: 'Inventory Details Updated Succesfully',inventorydata});
           }
           } catch (error) {
           res.status(500).send({ message: "Something went wrong", error });
        }
      };
  
exports.GetallInventory = async (req, res) => {
    try {
        const inventorydata = await Inventory.find({});
        const Totalinventory = inventorydata.length;
        return res.status(200).send({ Status: true, message: 'Retrieved All Inventory Succesfully',Totalinventory,inventorydata});
    } catch(error) {
        res.status(404).json({message: error.message});
    }
};
    
  
exports.DeleteInventory = async (req, res) => {
    try {
        const {inventory_id} = req.body;
        const inventorydata = await Inventory.findOneAndDelete({ _id:inventory_id},{ new: true });
          if (!inventorydata) {
              res.status(404).send({ message: `Inventory Data not found.` });
          } else {
            return res.status(200).send({ Status:true,message: "Inventory Deleted Successfully.",inventorydata });
          }
      } catch (error) {
          console.log('Error:', error);
          res.status(500).send({ message: "Something went wrong", error });
      }
    };


exports.routecalculation = async (req, res) => {
        try {
            const { startInventoryId, endInventoryId } = req.body;
    
            // Fetch inventories and users from the database
            const startInventory = await Inventory.findById(startInventoryId);
            const endInventory = await Inventory.findById(endInventoryId);
            const users = await User.find();
    
            if (!startInventory || !endInventory) {
                return res.status(404).json({ status: false, message: 'Inventory not found' });
            }
    
            const origin = `${startInventory.coordinates.latitude},${startInventory.coordinates.longitude}`;
            const destinations = [
                ...users.map(user => `${user.coordinates.latitude},${user.coordinates.longitude}`),
                `${endInventory.coordinates.latitude},${endInventory.coordinates.longitude}`
            ].join('|');
    
            // Google Distance Matrix API request
            const apiKey = "AIzaSyDgs82c1GlN8j7ADTgQAnWUtH3oo-83i9U"; // Consider using environment variables for security
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${apiKey}`;
    
            const response = await axios.get(url);
            const distances = response.data.rows[0].elements;
    
            // Constructing the delivery route with user info
            const deliveryRoutes = distances.map((element, index) => ({
                user: index < users.length ? users[index] : endInventory,
                distance: element.distance,
                duration: element.duration,
                status: element.status,
            }));
    
            // Optimizing route: First, filter valid routes (status OK), then sort
            const validRoutes = deliveryRoutes.filter(route => route.status === "OK");
            const optimizedRoute = validRoutes.sort((a, b) => a.distance.value - b.distance.value);
    
            // Final route includes the starting inventory, sorted user coordinates, and ending inventory
            const finalRoute = [startInventory, ...optimizedRoute.map(route => route.user.coordinates), endInventory];
    
            res.status(200).json({
                status: true,
                message: 'Optimized Delivery route calculated successfully',
                route: finalRoute,
                deliveryDetails: optimizedRoute
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: 'Something went wrong' });
        }
    };
    
    

    