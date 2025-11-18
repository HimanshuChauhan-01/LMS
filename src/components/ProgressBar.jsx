import React from 'react'

const ProgressBar = ({ progress, size = 'md', showLabel = true }) => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heightClasses[size]}`}>
        <div 
          className="bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, height: '100%' }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar