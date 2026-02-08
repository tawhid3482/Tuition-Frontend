// const BannerSkeleton = () => {
//   return (
//     <div className="w-full h-full bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-xl">
//       <div className="flex items-center justify-center h-full">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
//           <div className="w-32 h-4 bg-gray-300 rounded mx-auto"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BannerSkeleton;




const BannerSkeleton = () => {
  return (
    <div className="flex items-center justify-center animate-pulse">
      {/* right skeleton */}
      <div className="w-87.5 h-75 bg-gray-200 rounded-xl ml-6"></div>
    </div>
  );
};

export default BannerSkeleton;