"use client"

import React from 'react';

const Loader = ({ size = 'default', color = 'primary', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-[#0f4c81]',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  const containerClasses = fullScreen
    ? 'absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="relative">
        <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}></div>
        <div className={`absolute inset-0 border-2 border-transparent ${sizeClasses[size]} rounded-full`}></div>
      </div>
    </div>
  );
};

export default Loader;