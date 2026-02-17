import React from "react";

interface HomeProps {
  fill?: string;
  className?: string;
  [key: string]: any;
}

export const Home = ({ fill = "currentColor", className = "", ...props }: HomeProps) => {
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
        d="M4 13.45C3.55 13.11 3 12.55 3 12V11C3 10.45 3.45 10 4 10H5V8C5 6.9 5.9 6 7 6H9V4C9 3.45 9.45 3 10 3H14C14.55 3 15 3.45 15 4V6H17C18.1 6 19 6.9 19 8V10H20C20.55 10 21 10.45 21 11V12C21 12.55 20.45 12.11 20 12.45L13 17.45C12.45 17.8 11.55 17.8 11 17.45L4 13.45Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21L3 15.5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15.5L12 21Z"
        fill={fill}
      />
    </svg>
  );
};

export default Home;