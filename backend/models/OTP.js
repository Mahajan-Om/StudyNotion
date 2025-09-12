const mongoose = require('mongoose');
//const mailSender = require("../utils/mailSender");
 const otpTemplate = require("../Mail/Template/EmailVerification");
const mailSender = require("../utils/mailSender"); // make sure this is your nodemailer wrapper


const OTPSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60, //5 min
    }

})

// a function --> to send emails

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion" , otpTemplate(otp));
        console.log("Email sent successfully"  , mailResponse);
    }
    catch(error){
        console.log("Error occurred while sending mails " , error);
        throw error;
    }   
}

OTPSchema.pre("save" , async function(next){  // db me entry krne se pehle
    await sendVerificationEmail(this.email,this.otp);
    next();
}) 

module.exports = mongoose.model('OTP',OTPSchema);