import * as React from "react";

const FlutterwaveLogo = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28.87 28.87"
    width={25}
    height={25}
    id="flutterwave"
    {...props}
  >
    <g id="Layer_2">
      <g id="Layer_1-2">
        {/* Background */}
        <rect
          width={28.87}
          height={28.87}
          rx={6.48}
          ry={6.48}
          style={{
            fill: "#f5a623", // Flutterwave orange
          }}
        />

        {/* Flutterwave wave mark */}
        <path
          d="M6.2 15.4c2.1-1.9 4.6-1.9 6.7 0s4.6 1.9 6.7 0 4.6-1.9 6.7 0v2.4c-2.1-1.9-4.6-1.9-6.7 0s-4.6 1.9-6.7 0-4.6-1.9-6.7 0z"
          style={{
            fill: "#ffffff",
          }}
        />

        <path
          d="M6.2 11.7c2.1-1.9 4.6-1.9 6.7 0s4.6 1.9 6.7 0 4.6-1.9 6.7 0v2.4c-2.1-1.9-4.6-1.9-6.7 0s-4.6 1.9-6.7 0-4.6-1.9-6.7 0z"
          style={{
            fill: "#ffffff",
            opacity: 0.85,
          }}
        />
      </g>
    </g>
  </svg>
);

export default FlutterwaveLogo;