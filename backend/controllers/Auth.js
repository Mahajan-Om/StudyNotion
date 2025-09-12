
 const User = require('../models/User');
 const OTP = require('../models/OTP');
 const otpgenerator = require('otp-generator');
 const Profile = require('../models/Profile');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
 const mailSender = require('../utils/mailSender')
 const { passwordUpdated } = require("../Mail/Template/PasswordUpdate")
 require('dotenv').config();

 // Send OTP
 exports.sendOTP = async (req,res)=>{

    try{
        // fetch email from req ki body
        const {email} = req.body;

        // check email if already exists
        const checkUserPresent = await User.findOne({email});

        // if user already exits then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already Registered !"
            })
        }

        // generate otp for that install otp-generator package

        var otp = otpgenerator.generate(6 , {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        console.log("OTP generated : " , otp);

        // check unique otp or not

        let result = await OTP.findOne({otp:otp});

        while(result){  // jb tk result aa rha hai mtlb otp db me present hai to phirse nya otp generate krdo
            otp = otpgenerator.generate(6 , {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });

            result = await OTP.findOne({otp:otp});
        }

       // console.log("OTP genreated : " , otp);

        // now make otp entry in db

        const otpPayload = {email,otp}; // schema me createdAt bhi hai but yha nhi diya to uski default value le lega i.e Date.now()

        const  otpBody = await OTP.create(otpPayload) ;
        console.log(otpBody);


        res.status(200).json({
            success:true,
            message:"OTP sent Successfully.",
            otp
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    

 }

// signUp

exports.signUp = async (req,res)=>{

    try{
        // data detch from req ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp  // signup form me create account pe click krne ke baad verify ki window aati hai usme otp dalne se req me aa jaata hai
        } = req.body;

        // validate the krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){  // account type nhi rkha becz wo pehel se selcet hi hoga contact ka pane pe hai rkh sakte hai ya nhi bhi
            return res.status(403).json({
                success:false,
                message:"All fields are  Required !"
            })
        }

        // 2 password match krlo (create pass , confirm pass)

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirm password do not match , please try again "
            })
        }
        // check user already exits or not

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is Already Registered !",
            })
        }

        

        // find most recent otp stored for the user becz ek user ke liye different opt bhi store ho sakte hai jb wo bar bar login krta hai
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);  // createdAt -1 se sare otp descending order of their time lg jayege limit give most recdnt one
        console.log(recentOtp);

        // validate the otp
        if(recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message:"OTP Not Found"
            })
        }
        else if(recentOtp[0].otp !== otp ){
            // Invalid Otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            });
        }

        // Hash Passwords
        const hashedPassword = await bcrypt.hash(password,10);

        // Entry in Db

        const profileDetails = await Profile.create({  // user me profile dalna hai as a object uske liye objectid chahiye isliye db me entry krli aur uski id user me de denge
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user =await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        // return res 
        return res.status(200).json({
            success:true,
            message:"User registered Successfully",
            user
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User is not registered Successfully",
        })
    }
}

//login

exports.login = async (req,res)=>{
    try{
        // get data from req body

        const {email,password}= req.body;
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required , Please try again!"
            })
        }

        // user check exits or not

        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not Registered , Please Sign Up first ! "
            })
        }
        // generate jwt , after matching passwords
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType,
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn:"2h",
            });

            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options ={
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token" , token , options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully !"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is Incorrect !"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure , Please try again !"
        });
    }
}


// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}