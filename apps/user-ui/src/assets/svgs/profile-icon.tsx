import * as React from "react";

const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={23}
    viewBox="0 0 17 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx={8.5}
      cy={5.8}
      r={4.8}
      stroke="currentColor"
      strokeWidth={1.5}
    />
    <path
      d="M1 17.2
         C1 15.2 3.5 14 8.5 14
         C13.5 14 16 15.2 16 17.2
         C16 19.2 13.5 20.2 8.5 20.2
         C3.5 20.2 1 19.2 1 17.2 Z"
      stroke="currentColor"
      strokeWidth={1.5}
      fill="none"
    />
  </svg>
);

export default ProfileIcon;
