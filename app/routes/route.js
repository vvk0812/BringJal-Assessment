const express = require('express');
const UserController = require('../controllers/user');
const inventoryController = require('../controllers/inventory')
const router = express.Router();
const Auth = require('../middleware/refreshtoken')

router.post('/Registration',UserController.Registration);
router.post('/Login',UserController.Login);
router.post('/refresh-token',UserController.RefreshToken);

router.put('/Updateuser',Auth,UserController.Updateuserdetails);
router.delete('/DeleteUser',Auth,UserController.DeleteUser);
router.get('/GetAllusers',Auth,UserController.GetAllusers);
//http://localhost:3000/GetAllusers " Use this URl to retrive Total Num of Users"
//http://localhost:3000/GetAllusers?sort=oldest  "Use This URL to retrive users based on latest and oldest"
//http://localhost:3000/GetAllusers?date=28/10/2024  "Use This URL to retrive users based on createdat date"
//http://localhost:3000/GetAllusers?sort=oldest&date=28/10/2024 "Use This URL to retrive users based on oldest and Date"

router.post('/Creatinventory',inventoryController.Creatinventory);
router.put('/Updateinventory',inventoryController.Updateinventory);
router.get('/GetallInventory',inventoryController.GetallInventory);
router.delete('/DeleteInventory',inventoryController.DeleteInventory);


router.post('/Shortestroute',inventoryController.routecalculation);

router.get('/protected',Auth, (req, res) => {
  res.send('You have accessed a protected route.');
});

module.exports = router


