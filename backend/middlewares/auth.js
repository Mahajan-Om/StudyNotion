

const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// auth

// exports.auth = async (req,res,next)=>{
//     try{
//         // extract token
//         const token = req.cookies.token || req.body.token || req.header("Authorisation")?.replace("Bearer ","");

//         // if token missing then give response
//         if(!token){
//             return res.status(401).json({
//                 success:false,
//                 message:"Token is missing",
//             });
//         }

//         // verify the token
//         try{
//             const decode =  jwt.verify(token,process.env.JWT_SECRET); // login krne ke baad agr token match krta hai to us object ko decode me save kr dega aur ye decode humne reqme dal diya 
//             console.log(decode);
//             req.user = decode;
//         }
//         catch(error){
//             console.log(error);
//             return res.status(401).json({
//                 success:false,
//                 message:"Token is invalid !"
//             })
//         }
//         next();
//     }
//     catch(error){
//         console.log(error);
//         return res.status(401).json({
//             success:false,
//             message:"Something went wrong while validating the token !"
//         });
//     }
// }
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};


// isStudnet

exports.isStudent = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only ."
            })
        }

        next(); 
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified , Please try again !"
        })
    }
}

// isInstructor

exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                messege:"This is a protected route for Instructor only ."
            })
        }

        next(); 
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified , Please try again !"
        })
    }
}

// isAdmin
exports.isAdmin = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only ."
            })
        }

        next(); 
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified , Please try again !"
        })
    }
}