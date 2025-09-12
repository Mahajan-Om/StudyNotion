const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../Mail/Template/CourseEnrollmentEmail")
const { paymentSuccessEmail } = require("../Mail/Template/paymentSuccessfullEmail")
const CourseProgress = require("../models/CourseProgress")


// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}


// // Capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     // getCourseId and userId
//     const {course_id} = req.body;
//     const userId = req.user.id;

//     // validation

//     // validate course_id
//     if(!course_id){
//         return res.json({
//             success:false,
//             messege:"Please provide valid course id!"
//         })
//     }

//     // valid courseDetail
//     let course;
//     try{
//         course= await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 messege:"could not find the course",
//             })
//         }

//         // check if user has already paid for this course
//         const uid = new mongoose.Schema.Types.ObjectId(userId); // humne user ki id request me se li hai jo ki string me hai but course wale model me studentenrooled me user ki id objectid hai isliye usko object me convert kiya
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 messege:"Student is already Enrolled."
//             })
//         }
//     }
//     catch(error){
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             messege:error.message,
//         })
//     }

//     // order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount : amount * 100,
//         currency,
//         receipt : Math.random(Date.now()).toString(),
//         notes:{
//             courseId : course_id,
//             userId
//         }
//     };

//     try{
//         // intiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         // return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         })
//     }
//     catch(error){
//         console.log(error);
//         return res.json({
//             success:false,
//             message:"Could not intiate the order."
//         });
//     }

// }

// // verify signature of razorpay and server

// exports.verifySignature = async (req, res) => {
//   const webhookSecret = "12345678";  // ye secret jo hamara hai jo server pe pda hai

//   const signature  = req.headers["x-razorpay-signature"];  // ye signature jiske ander secret hai hai razorpay ne diya hai payment hone ke baad but wo razorpay secret ko direct nhi bhej dega usko hash function se encrypt kr bhejega ab isko decrypt nhi kr sakte so match kese karenge iske liye jo hamare server pe jo secret pda hai uspe same steps follow karenge jo razorpay ke secret ko hash krne ke use kiye the taki dono same ho jaye aur match ho jaye so niche diye gye whi steps hai.

//   const shasum = crypto.createHmac("sha256",webhookSecret); // step NO. A 

//     {/* HMAC (Hash-based Message Authentication Code) is a cryptographic technique used to:
//         Verify the integrity of a message (i.e., check it wasn’t changed in transit).
//         Authenticate the sender, ensuring the message really came from who you think it did.
//         HMAC combines a hash function (like SHA-256) with a secret key.
//         The result is a MAC (Message Authentication Code) — a unique fingerprint for the message+key combination.
//         Sha256 is hashing algorithm */}

//     shasum.update(JSON.stringify(req.body)); // step NO. B
//     const digest = shasum.digest("hex"); // step No. C
//     // kisi hashing algo jo output aata hai usko digest bolte hai aur wo hex me denite krte hai isliye aisa liya // ab ye A B C steps razorpay usually use krta hai hashing ke liye isliye humne same steps apne secret pe lga diye iska koi reasons nhi ye hai ye just rules hai.

//     if(signature === digest){
//       console.log("Payment is Authorized.");

//       // ab payment authorized ho gya hai but ab asli kahani suru hogi (see in notebook) so uske liye hume courseid aur userif chhahiye but hum ab usko req.body me se nhi nikal sakte becz ab api call frontend se nhi hui hai razorpay ne api call ki hai so humne jb razory ka order create kiya tha tb uske optios ke ander notes me userid aur courseid bhej di thi ab uski ko fetch kr lenege razorpya ki api ki req se
      
//       const {courseId , userId} = req.body.payload.payment.entity.notes;

//       // fullfill the action 
//       try{    // find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                                                                   {_id:courseId},
//                                                                   {$push:{
//                                                                     studentEnrolled:userId
//                                                                   }},
//                                                                   {new:true}
//             );

//             if(!enrolledCourse){
//               return res.status(500).json({
//                 success:false,
//                 messege:"Course Not Found"
//               })
//             }

//             console.log(enrolledCourse);

//             // find the student and the course to their enrollred courses

//             const enrolledStudent = await Course.findOneAndUpdate(
//                                                                   {_id:userId},
//                                                                   {$push:{
//                                                                     courses:courseId
//                                                                   }},
//                                                                   {new:true}
//             );

//             console.log(enrolledStudent);

//             // mail send krdo confirmation wala

//             const emailResponse = await mailSender(
//                                                   enrolledStudent.email,
//                                                   "congratulations from codeHelp",
//                                                   "Congradulation you have onboarded with the new course."     
//             )
//             console.log(emailResponse);

//             return res.status(200).json({
//               success:true,
//               messege:"signature verified and courses added."
//             })
//       }
//       catch(error){
//         console.log(error);
//         return res.status(500).json({
//           success:false,
//           messege:error.message,
//         })
//       }
//     }

//     else{
//       return res.status(400).json({
//         success:false,
//         messege:"Invalid Request",
//       })
//     }
// }

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideo: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

     // console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}