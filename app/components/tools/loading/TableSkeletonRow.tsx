import React from "react"

interface TableSkeletonRowProps {
  columns: number
  repeat?: number
}

const TableSkeletonRow: React.FC<TableSkeletonRowProps> = ({ columns, repeat = 5 }) => {
  return (
    <>
      {Array.from({ length: repeat }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default TableSkeletonRow
