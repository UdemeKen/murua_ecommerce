import React from "react";

interface PaymentProps {
  fill?: string;
  className?: string;
  [key: string]: any;
}

export const Payment = ({ fill = "currentColor", className = "", ...props }: PaymentProps) => {
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
        d="M10 16V10H6.9C6.9 10.6 6 12 6 12H21C21 12 20.1 10.6 20.1 10H16V16H10Z"
        fill={fill}
      />
      {/* Very common second path for credit card icons – chip + horizontal lines or contactless waves */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6H21C21.55 6 22 6.45 22 7V17C22 17.55 21.55 18 21 18H3C2.45 18 2 17.55 2 17V7C2 6.45 2.45 6 3 6ZM8 14H16V10H8V14Z M5 9H7V11H5V9Z"
        fill={fill}
      />
    </svg>
  );
};

export default Payment;