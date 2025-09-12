
// import React, { useEffect, useRef, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate, useParams, useLocation } from "react-router-dom"
// import Plyr from "plyr-react"
// import "plyr-react/plyr.css"

// import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
// import { updateCompletedLectures } from "../../../Slice/viewCourseSlice"
// import IconBtn from "../../common/IconBtn"

// const VideoDetails = () => {
//   const { courseId, sectionId, subSectionId } = useParams()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const plyrRef = useRef(null)
//   const dispatch = useDispatch()
//   const { token } = useSelector((state) => state.auth)
//   const { courseSectionData, courseEntireData, completedLectures } =
//     useSelector((state) => state.viewCourse)

//   const [videoData, setVideoData] = useState(null)
//   const [previewSource, setPreviewSource] = useState(null) // null instead of ""
//   const [videoEnded, setVideoEnded] = useState(false)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     ;(async () => {
//       if (!courseSectionData.length) return
//       if (!courseId && !sectionId && !subSectionId) {
//         navigate("/dashboard/enrolled-courses")
//       } else {
//         const filteredData = courseSectionData.filter(
//           (course) => course._id === sectionId
//         )
//         const filteredVideoData = filteredData?.[0]?.subSection.filter(
//           (data) => data._id === subSectionId
//         )
//         setVideoData(filteredVideoData ? filteredVideoData[0] : null)
//         setPreviewSource(courseEntireData?.thumbnail || null)
//         setVideoEnded(false)
//         console.log("VIDEO DATA:", filteredVideoData ? filteredVideoData[0] : null)
//       }
//     })()
//   }, [courseSectionData, courseEntireData, location.pathname, navigate, courseId, sectionId, subSectionId])

//   // Plyr event handlers
//   const handlePlyrReady = (player) => {
//     plyrRef.current = player

//     player.on("ended", () => {
//       console.log("Video ended via Plyr event")
//       setVideoEnded(true)
//     })

//     // Backup: Listen to native video element 'ended' event
//     if (player.media) {
//       player.media.addEventListener("ended", () => {
//         console.log("Video ended via HTML5 event")
//         setVideoEnded(true)
//       })
//     }

//     player.on("play", () => {
//       console.log("Video playing")
//       setVideoEnded(false)
//     })

//     player.on("pause", () => {
//       console.log("Video paused")
//     })

//     player.on("timeupdate", () => {
//       if (player.duration && player.currentTime) {
//         const timeLeft = player.duration - player.currentTime
//         if (timeLeft < 0.5 && timeLeft > 0) {
//           console.log("Video almost ended")
//         }
//       }
//     })
//   }

//   // check if first video
//   const isFirstVideo = () => {
//     if (!courseSectionData.length) return true
//     const currentSectionIndx = courseSectionData.findIndex(
//       (data) => data._id === sectionId
//     )
//     if (currentSectionIndx === -1) return true

//     const currentSubSectionIndx = courseSectionData[
//       currentSectionIndx
//     ]?.subSection?.findIndex((data) => data._id === subSectionId)

//     if (currentSubSectionIndx === -1) return true

//     return currentSectionIndx === 0 && currentSubSectionIndx === 0
//   }

//   // go to next video
//   const goToNextVideo = () => {
//     const currentSectionIndx = courseSectionData.findIndex(
//       (data) => data._id === sectionId
//     )
//     const noOfSubsections =
//       courseSectionData[currentSectionIndx].subSection.length
//     const currentSubSectionIndx = courseSectionData[
//       currentSectionIndx
//     ].subSection.findIndex((data) => data._id === subSectionId)

//     if (currentSubSectionIndx !== noOfSubsections - 1) {
//       const nextSubSectionId =
//         courseSectionData[currentSectionIndx].subSection[
//           currentSubSectionIndx + 1
//         ]._id
//       navigate(
//         `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
//       )
//     } else if (currentSectionIndx !== courseSectionData.length - 1) {
//       const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
//       const nextSubSectionId =
//         courseSectionData[currentSectionIndx + 1].subSection[0]._id
//       navigate(
//         `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
//       )
//     }
//   }

//   // check if last video
//   const isLastVideo = () => {
//     if (!courseSectionData.length) return true
//     const currentSectionIndx = courseSectionData.findIndex(
//       (data) => data._id === sectionId
//     )
//     if (currentSectionIndx === -1) return true

//     const noOfSubsections =
//       courseSectionData[currentSectionIndx]?.subSection?.length || 0
//     const currentSubSectionIndx = courseSectionData[
//       currentSectionIndx
//     ]?.subSection?.findIndex((data) => data._id === subSectionId)

//     if (currentSubSectionIndx === -1) return true

//     return (
//       currentSectionIndx === courseSectionData.length - 1 &&
//       currentSubSectionIndx === noOfSubsections - 1
//     )
//   }

//   // go to previous video
//   const goToPrevVideo = () => {
//     const currentSectionIndx = courseSectionData.findIndex(
//       (data) => data._id === sectionId
//     )
//     const currentSubSectionIndx = courseSectionData[
//       currentSectionIndx
//     ].subSection.findIndex((data) => data._id === subSectionId)

//     if (currentSubSectionIndx !== 0) {
//       const prevSubSectionId =
//         courseSectionData[currentSectionIndx].subSection[
//           currentSubSectionIndx - 1
//         ]._id
//       navigate(
//         `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
//       )
//     } else if (currentSectionIndx !== 0) {
//       const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
//       const prevSubSectionLength =
//         courseSectionData[currentSectionIndx - 1].subSection.length
//       const prevSubSectionId =
//         courseSectionData[currentSectionIndx - 1].subSection[
//           prevSubSectionLength - 1
//         ]._id
//       navigate(
//         `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
//       )
//     }
//   }

//   const handleLectureCompletion = async () => {
//     setLoading(true)
//     try {
//       const res = await markLectureAsComplete(
//         { courseId: courseId, subsectionId: subSectionId },
//         token
//       )
//       if (res) {
//         dispatch(updateCompletedLectures(subSectionId))
//       }
//     } catch (err) {
//       console.error("Error marking lecture complete:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRewatch = () => {
//     if (plyrRef.current && plyrRef.current.plyr) {
//       try {
//         plyrRef.current.plyr.restart()
//         // Play promise handling to avoid AbortError
//         const playPromise = plyrRef.current.plyr.play()
//         if (playPromise !== undefined) {
//           playPromise.catch((error) => {
//             console.log("Play interrupted:", error)
//           })
//         }
//         setVideoEnded(false)
//       } catch (error) {
//         console.error("Error restarting video:", error)
//       }
//     }
//   }

//   // Manual test function - remove in production
//   const handleTestVideoEnd = () => {
//     console.log("Manually triggering video end")
//     setVideoEnded(true)
//   }

//   // Plyr options
//   const plyrOptions = {
//     controls: [
//       "play-large",
//       "play",
//       "progress",
//       "current-time",
//       "duration",
//       "mute",
//       "volume",
//       "settings",
//       "fullscreen",
//     ],
//     settings: ["quality", "speed"],
//     quality: {
//       default: 720,
//       options: [1080, 720, 480, 360, 240],
//     },
//     speed: {
//       selected: 1,
//       options: [0.5, 0.75, 1, 1.25, 1.5, 2],
//     },
//     ratio: "16:9",
//     hideControls: false,
//     resetOnEnd: false,
//   }

//   return (
//     <div className="flex flex-col gap-5 text-white">
//       {/* Debug buttons - remove in production */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={handleTestVideoEnd}
//           className="bg-red-500 text-white px-4 py-2 rounded text-sm"
//         >
//           Test Video End
//         </button>
//         <button
//           onClick={() => setVideoEnded(false)}
//           className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
//         >
//           Reset Video End
//         </button>
//         <span className="text-sm text-gray-300 flex items-center">
//           Video Ended: {videoEnded ? "YES" : "NO"}
//         </span>
//       </div>

//       <div className="relative">
//         {!videoData ? (
//           previewSource ? ( // Render image only if previewSource is present
//             <img
//               src={previewSource}
//               alt="Preview"
//               className="h-full w-full rounded-md object-cover"
//             />
//           ) : null
//         ) : (
//           <div className="relative rounded-md overflow-hidden">
//             <Plyr
//               ref={plyrRef}
//               source={{
//                 type: "video",
//                 sources: [
//                   {
//                     src: videoData?.videoUrl,
//                     type: "video/mp4",
//                   },
//                 ],
//               }}
//               options={plyrOptions}
//               onPlyrReady={handlePlyrReady} // Correct event name
//             />

//             {/* Overlay after video ends */}
//             {videoEnded && (
//               <div
//                 style={{
//                   background:
//                     "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.3))",
//                 }}
//                 className="absolute inset-0 z-[9999] flex flex-col items-center justify-center font-inter pointer-events-auto"
//               >
//                 <div className="flex flex-col items-center space-y-4">
//                   {!completedLectures.includes(subSectionId) && (
//                     <IconBtn
//                       disabled={loading}
//                       onClick={handleLectureCompletion}
//                       text={!loading ? "Mark As Completed" : "Loading..."}
//                       customClasses="text-xl max-w-max px-6 py-3 mx-auto bg-yellow-50 text-richblack-900 font-semibold rounded-md hover:scale-95 transition-all duration-200"
//                     />
//                   )}

//                   <IconBtn
//                     disabled={loading}
//                     onClick={handleRewatch}
//                     text="Rewatch"
//                     customClasses="text-xl max-w-max px-6 py-3 mx-auto bg-white text-richblack-900 font-semibold rounded-md hover:scale-95 transition-all duration-200"
//                   />

//                   <div className="flex min-w-[250px] justify-center gap-x-4 text-xl mt-6">
//                     {!isFirstVideo() && (
//                       <button
//                         disabled={loading}
//                         onClick={goToPrevVideo}
//                         className="px-6 py-3 bg-richblack-700 text-white font-semibold rounded-md hover:bg-richblack-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Previous
//                       </button>
//                     )}
//                     {!isLastVideo() && (
//                       <button
//                         disabled={loading}
//                         onClick={goToNextVideo}
//                         className="px-6 py-3 bg-yellow-50 text-richblack-900 font-semibold rounded-md hover:bg-yellow-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Next
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="mt-4">
//         <h1 className="text-3xl font-semibold text-white">{videoData?.title}</h1>
//         <p className="pt-2 pb-6 text-richblack-200">{videoData?.description}</p>
//       </div>
//     </div>
//   )
// }

// export default VideoDetails
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import Plyr from "plyr-react"
import "plyr-react/plyr.css"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../Slice/viewCourseSlice"
import IconBtn from "../../common/IconBtn"




const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const plyrRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch video data safely
  useEffect(() => {
    if (!courseSectionData?.length || !courseEntireData) return

    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses")
      return
    }

    const section = courseSectionData.find((sec) => sec._id === sectionId)
    const subSection = section?.subSection?.find(
      (sub) => sub._id === subSectionId
    )

    setVideoData(subSection || null)
    setPreviewSource(courseEntireData?.thumbnail || null)
    setVideoEnded(false)
  }, [courseSectionData, courseEntireData, courseId, sectionId, subSectionId, navigate, location.pathname])

  // Plyr event handlers
  const handlePlyrReady = (player) => {
    plyrRef.current = player

    player.on("ended", () => setVideoEnded(true))
    if (player.media) {
      player.media.addEventListener("ended", () => setVideoEnded(true))
    }
    player.on("play", () => setVideoEnded(false))
  }

  // Check first and last video
  const getCurrentIndices = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (s) => s._id === sectionId
    )
    const currentSubIndex =
      currentSectionIndex !== -1
        ? courseSectionData[currentSectionIndex]?.subSection?.findIndex(
            (sub) => sub._id === subSectionId
          )
        : -1
    return { currentSectionIndex, currentSubIndex }
  }

  const isFirstVideo = () => {
    const { currentSectionIndex, currentSubIndex } = getCurrentIndices()
    return currentSectionIndex === 0 && currentSubIndex === 0
  }

  const isLastVideo = () => {
    const { currentSectionIndex, currentSubIndex } = getCurrentIndices()
    if (currentSectionIndex === -1 || currentSubIndex === -1) return true
    const lastSectionIndex = courseSectionData.length - 1
    const lastSubIndex =
      courseSectionData[lastSectionIndex]?.subSection?.length - 1
    return currentSectionIndex === lastSectionIndex && currentSubIndex === lastSubIndex
  }

  const goToNextVideo = () => {
    const { currentSectionIndex, currentSubIndex } = getCurrentIndices()
    if (currentSectionIndex === -1 || currentSubIndex === -1) return

    const section = courseSectionData[currentSectionIndex]
    if (currentSubIndex < section.subSection.length - 1) {
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${section.subSection[currentSubIndex + 1]._id}`
      )
    } else if (currentSectionIndex < courseSectionData.length - 1) {
      const nextSection = courseSectionData[currentSectionIndex + 1]
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      )
    }
  }

  const goToPrevVideo = () => {
    const { currentSectionIndex, currentSubIndex } = getCurrentIndices()
    if (currentSectionIndex === -1 || currentSubIndex === -1) return

    if (currentSubIndex > 0) {
      const section = courseSectionData[currentSectionIndex]
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${section.subSection[currentSubIndex - 1]._id}`
      )
    } else if (currentSectionIndex > 0) {
      const prevSection = courseSectionData[currentSectionIndex - 1]
      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${
          prevSection.subSection[prevSection.subSection.length - 1]._id
        }`
      )
    }
  }

  // Mark lecture complete
   const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    console.log("Token : ",token);
    console.log("Data " , res);
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }


  const handleRewatch = () => {
    if (plyrRef.current?.plyr) {
      plyrRef.current.plyr.restart()
      plyrRef.current.plyr.play().catch((e) => console.log("Play interrupted", e))
      setVideoEnded(false)
    }
  }

  const plyrOptions = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "fullscreen",
    ],
    settings: ["quality", "speed"],
    quality: { default: 720, options: [1080, 720, 480, 360, 240] },
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
    ratio: "16:9",
    hideControls: false,
    resetOnEnd: false,
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Debug buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setVideoEnded(true)}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
        >
          Test Video End
        </button>
        <button
          onClick={() => setVideoEnded(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
        >
          Reset Video End
        </button>
        <span className="text-sm text-gray-300 flex items-center">
          Video Ended: {videoEnded ? "YES" : "NO"}
        </span>
      </div>

      <div className="relative">
        {videoData ? (
          <div className="relative rounded-md overflow-hidden">
            <Plyr
              ref={plyrRef}
              source={{
                type: "video",
                // sources: [{ src: videoData.videoUrl || "", type: "video/mp4" }],
                sources: [{ src: typeof videoData?.videoUrl === "string" ? videoData.videoUrl : "", type: "video/mp4" }],
              }}
              options={plyrOptions}
              onPlyrReady={handlePlyrReady}
            />

            {/* Overlay after video ends */}
            {videoEnded && (
              <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center font-inter pointer-events-auto"
                   style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))" }}>
                <div className="flex flex-col items-center space-y-4">
                  {!completedLectures?.includes(subSectionId) && (
                    <IconBtn
                      disabled={loading}
                      onClick={handleLectureCompletion}
                      text={!loading ? "Mark As Completed" : "Loading..."}
                      customClasses="text-xl max-w-max px-6 py-3 mx-auto bg-yellow-50 text-richblack-900 font-semibold rounded-md"
                    />
                  )}
                  <IconBtn
                    disabled={loading}
                    onClick={handleRewatch}
                    text="Rewatch"
                    customClasses="text-xl max-w-max px-6 py-3 mx-auto bg-white text-richblack-900 font-semibold rounded-md"
                  />

                  <div className="flex min-w-[250px] justify-center gap-x-4 text-xl mt-6">
                    {!isFirstVideo() && (
                      <button
                        disabled={loading}
                        onClick={goToPrevVideo}
                        className="px-6 py-3 bg-richblack-700 text-white font-semibold rounded-md"
                      >
                        Previous
                      </button>
                    )}
                    {!isLastVideo() && (
                      <button
                        disabled={loading}
                        onClick={goToNextVideo}
                        className="px-6 py-3 bg-yellow-50 text-richblack-900 font-semibold rounded-md"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : previewSource ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <p className="text-white text-center">Video not available</p>
        )}
      </div>

      <div className="mt-4">
        <h1 className="text-3xl font-semibold text-white">
          {/* {videoData?.title || "Untitled Video"} */}
          {typeof videoData?.title === "string" ? videoData.title : "Untitled Video"}

        </h1>
        <p className="pt-2 pb-6 text-richblack-200">
          {typeof videoData?.description === "string"
            ? videoData.description
            : ""}
        </p>
      </div>
    </div>
  )
}

export default VideoDetails

