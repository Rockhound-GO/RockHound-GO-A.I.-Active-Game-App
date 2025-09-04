import React from 'react';

const AppLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M12 1.25l-7.5 4.33v8.66l7.5 4.33 7.5-4.33V5.58L12 1.25zm0 2.16l5.62 3.25-2.47 1.42L12 6.45l-3.15 1.82-2.47-1.42L12 3.41zm-6 3.46l2.47 1.42L6 10.11V6.87zm12 0v3.24l-2.47-1.82 2.47-1.42zM8.47 11.53L12 13.55l3.53-2.02L12 9.5l-3.53 2.03zm-1.12 4.13L6 14.87v-3.24l1.35 1.82 1.12.64zm8.3 0l1.12-.64 1.35-1.82v3.24l-1.35.79zm-4.15 2.4l-5.62-3.25v-2.06l6.25 3.61v2.03zm1.13 0v-2.03l6.25-3.61v2.06l-5.62 3.25z" />
  </svg>
);

export default AppLogoIcon;
