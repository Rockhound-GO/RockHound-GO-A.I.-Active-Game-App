import React from 'react';

interface AppLogoIconProps {
  className?: string;
  pinClassName?: string;
  crystalClassName?: string;
}

const AppLogoIcon: React.FC<AppLogoIconProps> = ({ className, pinClassName, crystalClassName }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <title>RockHound GO Logo</title>
    {/* The map pin shape, now a separate path for animation */}
    <path
      className={pinClassName}
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
    />
    {/* The crystal shape inside, now a separate path for animation */}
    <path
      className={crystalClassName}
      d="M10.5 11H8.5L11.5 4L14.5 11H12.5V14H10.5V11Z"
    />
  </svg>
);

export default AppLogoIcon;