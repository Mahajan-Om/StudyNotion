const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// create rating
exports.createRating = async (req,res)=>{

    try{
            // get user id

        const userId = req.user.id;
        
        // fetch daata from req ki body

        const {rating , review , courseId } =req.body;

        // checkk user is enrolled or not

        const courseDetails = await Course.findOne(
                                        {_id:courseId,
                                            studentEnrolled:{$elemMatch:{$eq:userId}},
                                        }
        )

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                messege:"Student is not enrolled in the course",  
            });
        }

        // check if user already reviewd the course

        const alreadyReviwed = await RatingAndReview.findOne({
                                                            user:userId,
                                                            course:courseId,
                                                            }
        );

        if(alreadyReviwed){
            return res.status(403).json({
                success:false,
                messege:"Course is already reviewed by the user"
            });
        }

        //  create rating and review
        const ratingReview = await RatingAndReview.create({
                                            rating, review, 
                                            course:courseId,
                                            user:userId,
                                        });
        
        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push: {
                                                ratingAndReview: ratingReview._id,
                                            }
                                        },
                                        {new: true});
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
                success:true,
                message:"Rating and Review created Successfully",
                ratingReview,
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

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {   //Each rating/review is linked to a specific course via its _id.So course in RatingAndReview stores the ObjectId of the course on which the rating was given.
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId), // string couseid ko objectid me convert kiya // Only fetches documents (ratings) where course == courseId from the request.So if you're passing Course A's ID, only reviews given on Course A are selected.
                    },
                },
                {
                    $group:{
                        _id:null, // group krne ke liye koi specific condition nhi hai so jitni bhi reviewes aaaye sbko group kr diya
                        averageRating: { $avg: "$rating"}, // sb revies ko grp krne ke baad unke rating fileds ka avg find kr liya
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,  // aggregate funct array return kr rha hai jiski value 0 pe pdi hui hai.
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image", // user me se bs ye perticular values lake dena jese hum bracket me krte the 
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}