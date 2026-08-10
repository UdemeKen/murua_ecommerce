import * as React from "react";

const HalfStar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <clipPath id="half-star-clip">
        <rect x="0" y="0" width="12" height="24" />
      </clipPath>
    </defs>

    {/* Full star outline */}
    <path
      d="M12 2.5L14.93 8.44L21.5 9.4L16.75 14.02L17.87 20.56L12 17.47L6.13 20.56L7.25 14.02L2.5 9.4L9.07 8.44L12 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Filled half */}
    <path
      d="M12 2.5L14.93 8.44L21.5 9.4L16.75 14.02L17.87 20.56L12 17.47L6.13 20.56L7.25 14.02L2.5 9.4L12 2.5Z"
      fill="currentColor"
      clipPath="url(#half-star-clip)"
    />
  </svg>
);

export default HalfStar;