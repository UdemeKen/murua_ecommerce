import * as React from "react";

const StarFilled = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" {...props}
    >
        <path 
            d="M12 17.27L18.18 21 16.54 13.97L22 9.24L14.81 8.63L12 2 9.19 8.63L2 9.24L7.46 13.97L5.82 21 12 17.27Z" 
            fill="currentColor" 
            fillRule="evenodd"
            clipRule="evenodd"
        />
    </svg>
);

export default StarFilled;