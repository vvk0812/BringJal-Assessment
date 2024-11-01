
const { expressjwt } = require("express-jwt");
const JWT_SECRET ="7f2bde3ea53b57f098224d74167ecfb2";
const jwt = require("jsonwebtoken");


const Auth = async(req,res,next)=>{
    try {
        
        const accessToken = req.headers['authorization']?.split(' ')[1];
     if (!accessToken) {
          return res.status(400).json({ status: false, message: 'Un-Authorized User' });
        }
    
        // Verify the access token
        jwt.verify(accessToken, JWT_SECRET, (err, user) => {
          if (err) {
            // Check if the error is due to the token being expired
            if (err.name === 'TokenExpiredError') {
              return res.status(401).json({
                status: false,
                message: 'Token expired', // Custom message when token is expired
              });
            }
            // Handle other types of JWT errors
            return res.status(400).json({ status: false, message: 'Invalid token' });
          }
          req.user = user;
          next();
        });
      } catch (err) {
        return res.status(500).json({
          status: false,
          message: 'Something went wrong',
        });
      }
    };

module.exports = Auth;