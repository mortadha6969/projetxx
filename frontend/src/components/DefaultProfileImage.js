import React from 'react';

const DefaultProfileImage = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="20" fill="#E5E7EB" />
      <path
        d="M20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10Z"
        fill="#9CA3AF"
      />
      <path
        d="M10 30C10 25.5817 14.4772 22 20 22C25.5228 22 30 25.5817 30 30V32H10V30Z"
        fill="#9CA3AF"
      />
    </svg>
  );
};

export default DefaultProfileImage;
