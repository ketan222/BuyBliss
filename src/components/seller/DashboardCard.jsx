import React from 'react'

function DashboardCard({ title, value, icon, change, isWarning = false, loading = false }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <p className="text-gray-500 text-sm mb-2">{title}</p>
            <div className="p-2 rounded-md bg-gray-100">{icon}</div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          
          <p className={`text-sm ${isWarning ? 'text-orange-600' : 'text-gray-500'}`}>
            {change}
          </p>
        </>
      )}
    </div>
  )
}

export default DashboardCard