// import IconBtn from "./IconBtn"

// export default function ConfirmationModal({ modalData }) {
//   return (
//     <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-richblack-800 bg-opacity-50 backdrop-blur-sm">
//       <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
//         <p className="text-2xl font-semibold text-richblack-5">
//           {modalData?.text1}
//         </p>
//         <p className="mt-3 mb-5 leading-6 text-richblack-200">
//           {modalData?.text2}
//         </p>
//         <div className="flex items-center gap-x-4">
//           <IconBtn
//             onClick={modalData?.btn1Handler}
//             text={modalData?.btn1Text}
//           />
//           <button
//             className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900"
//             onClick={modalData?.btn2Handler}
//           >
//             {modalData?.btn2Text}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-200">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">
          {/* Replace IconBtn with regular button to test */}
          <button
            className="cursor-pointer rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
            onClick={() => {
              console.log("Logout button clicked in modal"); // Debug log
              modalData?.btn1Handler?.(); // Safe call with optional chaining
            }}
          >
            {modalData?.btn1Text}
          </button>
          <button
            className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-300 transition-all duration-200"
            onClick={() => {
              console.log("Cancel button clicked in modal"); // Debug log
              modalData?.btn2Handler?.(); // Safe call with optional chaining
            }}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}