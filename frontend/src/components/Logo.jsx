import React from 'react';

const Logo = ({ size = 28, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="4" y="4" width="9" height="9" rx="1.5" fill="currentColor" fillOpacity="0.4"/>
    <rect x="11" y="11" width="9" height="9" rx="1.5" fill="currentColor"/>
  </svg>
);

export default Logo;
