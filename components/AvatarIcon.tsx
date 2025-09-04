import React from 'react';

// --- Individual SVG Icon Components ---

const DefaultAvatar = (props: { className?: string }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const HelmetAvatar = (props: { className?: string }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PickaxeAvatar = (props: { className?: string }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l1.285 1.285a1 1 0 001.414 0L7.414 2.586a1 1 0 011.414 0L10.543 4.3a1 1 0 001.414 0L13.672 2.586a1 1 0 011.414 0L16.8 4.3a1 1 0 001.414 0L20 2.586m-5.879 14.121L12 18.5l-2.121-2.121" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 5.343a8 8 0 10-11.314 11.314 8 8 0 0011.314-11.314z" />
    </svg>
);

const CrystalAvatar = (props: { className?: string }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 8.5l10 13.5L22 8.5L12 2z" />
    </svg>
);

const CompassAvatar = (props: { className?: string }) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16.634l-2.738-1.44a1 1 0 010-1.788L8 11.966m4-7.602l2.738 1.44a1 1 0 010 1.788L12 14.034m-4 2.598l4-7.602m0 0l4 7.602" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);


// --- Main Component ---

interface AvatarIconProps {
    avatarId: string;
    className?: string;
}

const AvatarIcon: React.FC<AvatarIconProps> = ({ avatarId, className }) => {
    switch (avatarId) {
        case 'helmet':
            return <HelmetAvatar className={className} />;
        case 'pickaxe':
            return <PickaxeAvatar className={className} />;
        case 'crystal':
            return <CrystalAvatar className={className} />;
        case 'compass':
            return <CompassAvatar className={className} />;
        case 'default':
        default:
            return <DefaultAvatar className={className} />;
    }
};

export default AvatarIcon;