const User = require('../model/User');
const Taskdata= require('../model/inventory');
const jwt = require("jsonwebtoken");
const expressjwt = require("express-jwt");
const bcrypt = require("bcrypt");
require('cookie-parser')
const JWT_SECRET ="7f2bde3ea53b57f098224d74167ecfb2";
const REFRESH_TOKEN_SECRET ="b3f838bd47706d46841c49655ce76d6e";

const { DateTime } = require('luxon');

//  const JWT_SECRET =process.env.JWT_SECRET;
//  const REFRESH_TOKEN_SECRET =process.env.REFRESH_TOKEN_SECRET;

exports.RefreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ Status: false, message: 'Refresh token required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Generate a new access token (valid for 5 minutes)
    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({Status: true,message:"user acces token regenerated",accessToken: accessToken});

  } catch (error) {
    console.error(error);
    return res.status(403).json({ Status: false, message: 'Invalid refresh token' });
  }
};

exports.Registration = async (req, res) => {
  try {
    const { name, email, password, mobile, coordinates } = req.body;
    const { latitude, longitude } = coordinates || {};

    if (!name || !email || !password || !mobile || !coordinates) {
      return res.status(400).json({ Status: false, message: 'Please Fill All The Fields' });
    }
    const oldUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] });
    if (oldUser) {
      return res.status(400).json({ Status: false, message: "User with this email or mobile already exists. Please login." });
    }
    const encryptPassword = await bcrypt.hash(password, 10);

    // Format date as day/month/year
    const formattedDate = new Intl.DateTimeFormat('en-GB').format(new Date());

    const user = new User({
      name,
      email,
      password: encryptPassword,
      mobile,
      coordinates: { latitude, longitude },
      createdAt: formattedDate,  // Stores date in day/month/year format
    });

    await user.save();
    console.log(user);
    return res.status(201).json({Status: true,message: 'User Registered Successfully',user});
} catch (err) {
    console.error(err);
    return res.status(500).json({ Status: false, message: 'Something went wrong' });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ Status: false, message: 'Please fill all the fields' });
    }
    const Userdata = await User.findOne({ email: email });
    if (!Userdata) {
      return res.status(400).send({ Status: false, message: "Please register to login" });
    }

    const passwordcompare = await bcrypt.compare(password, Userdata.password);

    if (passwordcompare) {
      // Generate access token (valid for 1 days)
      const accessToken = jwt.sign({ id: Userdata._id, email: email }, JWT_SECRET, { expiresIn: '2d' });

      // Generate refresh token (valid for 7 days)
      const refreshToken = jwt.sign({ id: Userdata._id, email: email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    
      return res.status(201).json({Status: true,message: 'User login successfully',Userdata,accessToken:accessToken,refreshToken:refreshToken});
    } else {
      return res.status(400).json({ Status: false, message: 'Invalid password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Status: false, message: 'Something went wrong' });
  }
};

exports.Updateuserdetails = async (req, res) => {
  try {
      const { user_id,name,email,password,mobile,coordinates } = req.body;
      const { latitude, longitude } = coordinates || {};

      const userdata = await User.findByIdAndUpdate({ _id:user_id},{ $set: {name:name,email:email,password:password,mobile:mobile,coordinates:{ latitude, longitude }}},{ new: true });
      if (!userdata) {
          res.status(404).send({ message: `User Data Not Found.` });
         } else {
        return res.status(200).send({ Status: true, message: 'Userdetails Updated Succesfully',userdata});
         }
         } catch (error) {
         res.status(500).send({ message: "Something went wrong", error });
      }
    };

exports.GetAllusers = async (req, res) => {
      try {
        const { sort, date } = req.query;  
    
        // Base query
        let query = {};
        if (date) {
          query.createdAt = date;
        }
    
        let sortOrder = { createdAt: -1 }; // Latest first
        if (sort === 'oldest') {
          sortOrder = { createdAt: 1 }; // Oldest first
        }
    
        // Fetch users based on the query and sort order
        const userdata = await User.find(query).sort(sortOrder);
    
        const Totalusers = userdata.length;
        return res.status(200).send({Status: true,message: 'Retrieved All Users Successfully',Totalusers,userdata});
    } catch (error) {
        console.error(error);
        res.status(500).json({ Status: false, message: error.message });
      }
    };

exports.DeleteUser = async (req, res) => {
  try {
      const {user_id} = req.body;
      const userdata = await User.findOneAndDelete({ _id:user_id},{ new: true });
        if (!userdata) {
            res.status(404).send({ message: `User not found.` });
        } else {
          return res.status(200).send({ Status:true,message: "User Deleted Successfully.", userdata });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({ message: "Something went wrong", error });
    }
  };






  // exports.GetAllusers = async (req, res) => {
//     try {
//         const { sort, date } = req.query;  
//         let query = {};
//         if (date) {
//             const parsedDate = DateTime.fromFormat(date, 'dd/MM/yyyy');
//             if (!parsedDate.isValid) {
//                 return res.status(400).json({ Status: false, message: 'Invalid date format. Please use DD/MM/YYYY format.' });
//             }
//             const startOfDay = parsedDate.startOf('day').toJSDate(); // Start of the day
//             const endOfDay = parsedDate.endOf('day').toJSDate(); // End of the day

//             query.createdAt = {
//                 $gte: startOfDay,
//                 $lte: endOfDay
//             };
//         }

//         // Determine sort order
//         let sortOrder = { createdAt: -1 }; // Latest first
//         if (sort === 'oldest') {
//             sortOrder = { createdAt: 1 }; // Oldest first
//         }

//         // Fetch users based on the query and sort order
//         const userdata = await User.find(query).sort(sortOrder);

//         const Totalusers = userdata.length;
//         return res.status(200).send({ Status: true, message: 'Retrieved All Users Successfully', Totalusers, userdata });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ Status: false, message: error.message });
//     }
// };