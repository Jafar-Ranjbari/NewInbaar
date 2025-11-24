import React from "react"

interface ImageTextSkeletonProps {
  repeat?: number
  imageHeight?: number
  textLines?: number
}

const ImageTextSkeleton: React.FC<ImageTextSkeletonProps> = ({
  repeat = 4,
  imageHeight = 150,
  textLines = 2,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden p-3"
        >
          {/* تصویر */}
          <div
            className="bg-gray-200 w-full rounded-xl mb-3"
            style={{ height: imageHeight }}
          ></div>

          {/* متن زیر تصویر */}
          <div className="space-y-2">
            {Array.from({ length: textLines }).map((_, i) => (
              <div
                key={i}
                className={`h-4 bg-gray-200 rounded ${i === textLines - 1 ? "w-2/3" : "w-full"}`}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImageTextSkeleton
