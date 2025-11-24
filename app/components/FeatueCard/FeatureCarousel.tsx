//  "use client";

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import FeatureCard from "./FeatureCard";
// import { features } from "./CardData";
// import { useQuery } from "@tanstack/react-query";
// import ImageTextSkeleton from "../tools/loading/ImageTextSkeleton";

// // 🔹 Simulate a short API delay to preload data
// const fetchFeatures = async () => {
//   return new Promise<typeof features>((resolve) => {
//     setTimeout(() => resolve(features), 1000); // 1s delay
//   });
// };

// const FeatureCarousel: React.FC = () => {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["features"],
//     queryFn: fetchFeatures,
//     staleTime: 1000 * 60 * 5, // cache for 5 min
//   });

//   if (isLoading) {
//     return <ImageTextSkeleton repeat={4} />;
//   }

//   if (isError) {
//     return (
//       <div className="p-6 text-center text-red-500">
//         خطا در بارگذاری اطلاعات ویژگی‌ها.
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         هیچ ویژگی‌ای برای نمایش وجود ندارد.
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full">
//       {/* Left arrow */}
//       <button
//         id="prev-btn"
//         className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:cursor-pointer hover:bg-white"
//       >
//         <FaChevronLeft className="text-gray-800 w-5 h-5" />
//       </button>

//       {/* Swiper */}
//       <Swiper
//         modules={[Navigation]}
//         navigation={{
//           prevEl: "#prev-btn",
//           nextEl: "#next-btn",
//         }}
//         spaceBetween={20}
//         slidesPerView={4}
//         loop={true}
//         autoplay={{
//           delay: 2500, // هر ۲.۵ ثانیه بچرخه
//           disableOnInteraction: false, // با تعامل کاربر متوقف نشه
//         }}
//         breakpoints={{
//           320: { slidesPerView: 1 },
//           640: { slidesPerView: 2 },
//           1024: { slidesPerView: 4 },
//         }}
//       >
//         {data.map((feature, index) => (
//           <SwiperSlide key={index} className="h-auto">
//             <FeatureCard card={feature} />
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* Right arrow */}
//       <button
//         id="next-btn"
//         className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full hover:cursor-pointer bg-white/80 p-2 shadow-md hover:bg-white"
//       >
//         <FaChevronRight className="text-gray-800 w-5 h-5" />
//       </button>
//     </div>
//   );
// };

// export default FeatureCarousel;


"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // ⬅️ Autoplay اضافه شد
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FeatureCard from "./FeatureCard";
import { features } from "./CardData";
import { useQuery } from "@tanstack/react-query";
// import ImageTextSkeleton from "../tools/loading/ImageTextSkeleton";

const fetchFeatures = async () => {
  return new Promise<typeof features>((resolve) => {
    setTimeout(() => resolve(features), 1000);
  });
};

const FeatureCarousel: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
    staleTime: 1000 * 60 * 5,
  });

  // if (isLoading) return <ImageTextSkeleton repeat={4} />;

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        خطا در بارگذاری اطلاعات ویژگی‌ها.
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">
        هیچ ویژگی‌ای برای نمایش وجود ندارد.
      </div>
    );

  return (
    <div className="relative w-full">
      {/* Left arrow */}
      <button
        id="prev-btn"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:cursor-pointer hover:bg-white"
      >
        <FaChevronLeft className="text-gray-800 w-5 h-5" />
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]} // ⬅️ اینجا هم اضافه شد
        navigation={{
          prevEl: "#prev-btn",
          nextEl: "#next-btn",
        }}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        autoplay={{
          delay: 1500, // هر ۲.۵ ثانیه بچرخه
          disableOnInteraction: false, // با تعامل کاربر متوقف نشه
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {data.map((feature, index) => (
          <SwiperSlide key={index} className="h-auto">
            <FeatureCard card={feature} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Right arrow */}
      <button
        id="next-btn"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full hover:cursor-pointer bg-white/80 p-2 shadow-md hover:bg-white"
      >
        <FaChevronRight className="text-gray-800 w-5 h-5" />
      </button>
    </div>
  );
};

export default FeatureCarousel;
