const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// resetpasswordtoken
exports.resetPasswordToken = async (req,res)=>{

    try{
        // get email from req ki body
        const email = req.body.email ; // or const {email} = req.body

        //check user for this email , email validation
        const user = await User.findOne({email:email});

        if(!user){
            return res.status(402).json({
                success:false,
                messege:"User is not registered !"
            })
        }

        // generate token

        const token = crypto.randomUUID();

        // update user by adding token and expiration time

        const updateDetails = await User.findOneAndUpdate(
                                                        {email:email},
                                                        {
                                                            token:token,
                                                            resetPasswordExpires: Date.now() + 5*60*1000
                                                        },
                                                        {new:true}
        );

        //create url
        const url = `studynotionnn.netlify.app/update-password/${token}` // har user ke alg alg reset paswd wali link open hogi

        // send mail containing the url
        await mailSender(email,
                        "Password Reset Link",
                        `Your Link for email verification is ${url} . Please click this url to reser your password.`,
        );
        //return responses

        return res.json({
            success:true,
            messege:"Email sent Successfully , Please check email and chnage password !"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            messege:"Something went wrong while resetting the password !"
        })
    }
}

// resetpassword 

exports.resetPassword = async (req,res)=>{

    try{
        // get data

        const {password , confirmPassword , token }= req.body; // but humne upr token to url ke nader dala hai req me kese aa gya becz frontend usko req me dal rha hai
        //valiadtion
        if(password !== confirmPassword){
            return res.json({
                success:false,
                messege:"Password are not matching ",
            }
            )
        }
        //get userdetails from db using token i.e jo password reset kiya usko db me user me bhi update krna pdega uske liye user lana padega ab konsa user lana hai vo token se decide hoga isliye user model token aur expires itme add kiya
        
        const userDetails = await User.findOne({token:token});
        // if no-entry invalid token
        if(!userDetails){
            return res.json({
                success:false,
                messege:"Token is invalid !",
            })
        }
        //check token expiration time

        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                sucess:false,
                messege:"Token is expired , Please regenerate your Token !"
            })
        }
        // hash pwd
        const hashedPassword = await bcrypt.hash(password,10);

        //password update 
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        )

        // return response
        return res.status(200).json({
            success:true,
            messege:"Password Reset Succesfully."
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            messege:"Error in reseting password !"
        })
    }
}