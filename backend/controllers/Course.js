const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const Category = require("../models/Category");
const {uploadImageToCloudinary} = require("../utils/photoUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")

// create course handler function
exports.createCourse = async (req,res)=>{

    try{
        // data fetch 

        let {courseName,courseDescription, whatWillYouLearn,price,category,tag,status} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // const tag = JSON.parse(_tag)
        // const instructions = JSON.parse(_instructions)

        // console.log("tag", tag)
        // console.log("instructions", instructions)

        // validation 
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !category){
            return res.status(400).json({
                success:false,
                message:"All fields are required!"
            })
        }



      if (!status || status === undefined) {
        status = "Draft"
    }

        // check for instructor // ab hum middleware me instructor ki validation kr chuke hai but yha phirse kr rhe hai becz jb course ka data denege tb intructor ki id bhi deneg to usko usko db se check krna padega ki instructor correct hai ya nhi
        const userId = req.user.id;
        const instructionDetails = await User.findById(userId);
        console.log("Instruction Details :" , instructionDetails);

        if(!instructionDetails){
            return res.status(400).json({
                success:false,
                message:"Instruction Details are not found"
            })
        }

        //check given tag is valid or not
        const categoryDetails = await Category.findById(category);  // see tag course humne tag as a object id pass kiya hai hai to tag ke ander object ki id aayi hogi isliye tag ka use kr liya 
        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"Success Details are not found"
            })  
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        // create an new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructionDetails._id,  // isliey instructor details nikala tha becz i=course wale model instructor objectid leta  hai isliye userid nikale ke us id ke liye instructor details nikali li aur ab instructor details ki id course me instructor wale field me rkh di
            whatWillYouLearn:whatWillYouLearn,
            price,
            category:categoryDetails._id,  // direct tag bhi likh sakte ho becz tag id hi ahi becz course ke model tag as a id pass kra tha aur usi req me se tag ko nikala hai
            thumbnail:thumbnailImage.secure_url,
            tag:tag,
            status:status,
        })

        // add the new course to the user schema of instructor
        await User.findOneAndUpdate(  // aisa user dhundo jiski id given instruction ki id ke equal ho
            {_id:instructionDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );

        // update the tag ka schema
        await Category.findOneAndUpdate(
            {_id:category},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );
        // return res

        return res.status(200).json({
            success:true,
            message:"course created successfully.",
            data:newCourse,
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        })
    }
}
// Edit Course Details
// exports.editCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const updates = req.body
//     const course = await Course.findById(courseId)

//     if (!course) {
//       return res.status(404).json({ error: "Course not found" })
//     }

//     // If Thumbnail Image is found, update it
//     console.log("Files" , req.files);
//     if (req.files) {
//       console.log("thumbnail update")
//       const thumbnail = req.files.thumbnailImage
//       const thumbnailImage = await uploadImageToCloudinary(
//         thumbnail,
//         process.env.FOLDER_NAME
//       )
//       course.thumbnail = thumbnailImage.secure_url
//     }

//     // Update only the fields that are present in the request body
//     for (const key in updates) {
//       if (updates.hasOwnProperty(key)) {
//         if (key === "tag" || key === "instructions") {
//           course[key] = JSON.parse(updates[key])
//         } else {
//           course[key] = updates[key]
//         }
//       }
//     }

//     await course.save()

//     const updatedCourse = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()

//     res.json({
//       success: true,
//       message: "Course updated successfully",
//       data: updatedCourse,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     })
//   }
// }

exports.editCourse = async (req, res) => {
  try {
    console.log("=== EDIT COURSE API STARTED ===")
    console.log("Request body:", JSON.stringify(req.body, null, 2))
    console.log("Request files:", req.files)

    const {
      courseId,
      courseName,
      courseDescription,
      price,
      tag,
      category,
      status,
      whatWillYouLearn,
      instructions,
    } = req.body;

    // Validate courseId
    if (!courseId) {
      console.log("ERROR: No courseId provided")
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      })
    }

    const mongoose = require('mongoose')
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      console.log("ERROR: Invalid courseId format:", courseId)
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format"
      })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      console.log("ERROR: Course not found")
      return res.status(404).json({
        success: false,
        message: "Course not found"
      })
    }

    console.log("Course found:", course.courseName || course.title)

    // Update editable fields if they are provided
    if (courseName) course.courseName = courseName
    if (courseDescription) course.courseDescription = courseDescription
    if (price) course.price = price
    if (tag) course.tag = Array.isArray(tag) ? tag : [tag]
    if (category) course.category = category
    if (status) course.status = status
    if (whatWillYouLearn) course.whatWillYouLearn = whatWillYouLearn
    if (instructions) course.instructions = Array.isArray(instructions) ? instructions : [instructions]

    // Handle thumbnail upload
    if (req.files && req.files.thumbnailImage) {
      try {
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME || "courses"
        )
        course.thumbnail = thumbnailImage.secure_url
        console.log("Thumbnail updated successfully")
      } catch (uploadError) {
        console.error("Thumbnail upload error:", uploadError)
        return res.status(500).json({
          success: false,
          message: "Failed to upload thumbnail",
          error: uploadError.message
        })
      }
    }

    // Save updated course
    console.log("Saving course...")
    await course.save()
    console.log("Course saved successfully")

    // Fetch updated course with population
    let updatedCourse
    try {
      updatedCourse = await Course.findById(courseId)
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
    } catch (populateError) {
      console.error("Population error:", populateError)
      updatedCourse = await Course.findById(courseId)
    }

    console.log("=== EDIT COURSE API SUCCESS ===")

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })

  } catch (error) {
    console.error("=== EDIT COURSE API ERROR ===")
    console.error("Error name:", error.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}



// getall courses handler functions

exports.getAllCourses = async (req,res)=>{
    try{
        const allCourses = await Course.find({},{
                                                courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                ratingAndReview:true,
                                                studentEnrolled:true

        })
        .populate('instructor')
        .exec()

        return res.status(200).json({
            success:true,
            message:"Data for all Courses is fetched Successfully",
            data:allCourses
        })
    }
    catch(error){
        console.log(error);
        return res.status(200).json({
            success:false,
            message:"Cannot Fetch course data",
            error:error.message
        })
    }
}

// get all courses details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    console.log("Received courseId in backend:", courseId);
    const userId = req.user.id
    console.log("Brfore Calling API");
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
      console.log("After Calling API");

    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }
    console.log("Idhr se error aaya")
    console.log("courseDetails" , courseDetails);
    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideo: courseProgressCount?.completedVideo
          ? courseProgressCount?.completedVideo
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}