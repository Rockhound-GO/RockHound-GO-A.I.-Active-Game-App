import React from 'react';

const AppLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor" // Using fill for a solid, modern look
    className={className}
    aria-hidden="true"
  >
    <title>RockHound GO Logo</title>
    {/* This path creates a location pin shape with a stylized crystal/rock inside. */}
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1.5 9h-2l3-7 3 7h-2v3h-2v-3z" />
  </svg>
);

export default AppLogoIcon;
