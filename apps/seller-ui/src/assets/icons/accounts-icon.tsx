import React from "react";

interface AccountsIconProps {
  fill?: string;
  className?: string;
  [key: string]: any;
}

export const AccountsIcon = ({ fill = "currentColor", className = "", ...props }: AccountsIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`nextui-c-PJLV nextui-c-PJLV-ibxboX-css ${className}`.trim()}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Zm4 12a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm0-4a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm0-4a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z"
        fill={fill}
      />
      {/* Common variant with people silhouettes — adjust if your full path differs */}
      {/* <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2H3Zm13.13-3.87a4 4 0 1 0 0-7.75 4 4 0 0 0 0 7.75ZM21 21v-2a4 4 0 0 0-3-3.85"
        fill={fill}
      /> */}
    </svg>
  );
};

export default AccountsIcon;