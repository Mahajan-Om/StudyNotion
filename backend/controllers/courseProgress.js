// const mongoose = require("mongoose")
// const Section = require("../models/Section")
// const SubSection = require("../models/SubSection")
// const CourseProgress = require("../models/CourseProgress")
// const Course = require("../models/Course")

// const updateCourseProgress = async (req, res) => {
//   const { courseId, subsectionId } = req.body
//   const userId = req.user.id



//   try {
//           // Validate ObjectIds
//   if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(subsectionId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid courseId or subsectionId format",
//       });
//     }
//     // Check if the subsection is valid
//     const subsection = await SubSection.findById(subsectionId)
//     if (!subsection) {
//       return res.status(404).json({ error: "Invalid subsection" })
//     }

//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseId: courseId,
//       userId: userId,
      
//     })

//     console.log("course progress" , courseProgress)

//     if (!courseProgress) {
//       // If course progress doesn't exist, create a new one
//       return res.status(404).json({
//         success: false,
//         message: "Course progress Does Not Exist",
//       })
//     } else {
//       // If course progress exists, check if the subsection is already completed
//       if (courseProgress.completedVideo.includes(subsectionId)) {
//         return res.status(400).json({ error: "Subsection already completed" })
//       }

//       // Push the subsection into the completedVideos array
//       courseProgress.completedVideo.push(subsectionId)
//     }

//     // Save the updated course progress
//     await courseProgress.save()

//     return res.status(200).json({ message: "Course progress updated" })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }

// module.exports={
//   updateCourseProgress
// };

const mongoose = require("mongoose")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")

const updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(subsectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId or subsectionId format",
      })
    }

    // Check if the subsection exists
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ success: false, message: "Invalid subsection" })
    }

    // Find course progress for this user & course
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress does not exist",
      })
    }

    // Check if subsection is already completed
    const isCompleted = courseProgress.completedVideo.some(
      (id) => id.toString() === subsectionId.toString()
    )

    if (isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Subsection already completed",
      })
    }

    // Add subsection to completedVideo
    courseProgress.completedVideo.push(new mongoose.Types.ObjectId(subsectionId))

    // Save updates
    await courseProgress.save()

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
      data: courseProgress,
    })
  } catch (error) {
    console.error("Error updating course progress:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  updateCourseProgress,
}
