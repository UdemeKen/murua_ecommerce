import React from "react";

const GoogleButton = () => {
  return (
    <div className="w-full flex justify-center">
      <button
        type="button"
        className="h-[46px] px-4 flex items-center gap-3 cursor-pointer
                   border border-blue-100 rounded-md
                   hover:bg-gray-50 transition"
      >
        {/* Google Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 48 48"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.3 1.53 7.75 2.8l5.65-5.65C33.87 3.53 29.36 1.5 24 1.5 14.73 1.5 6.73 6.94 3.01 14.8l6.98 5.42C11.57 13.53 17.27 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.7 7.17l7.2 5.6c4.21-3.88 6.3-9.6 6.3-17.02z"
          />
          <path
            fill="#FBBC05"
            d="M9.99 28.22a14.5 14.5 0 0 1 0-8.44l-6.98-5.42a23.93 23.93 0 0 0 0 19.28l6.98-5.42z"
          />
          <path
            fill="#34A853"
            d="M24 46.5c5.36 0 9.87-1.77 13.16-4.8l-7.2-5.6c-2 1.35-4.55 2.15-5.96 2.15-6.73 0-12.43-4.03-14.01-9.72l-6.98 5.42C6.73 41.06 14.73 46.5 24 46.5z"
          />
        </svg>

        {/* Text */}
        <span className="text-sm font-medium text-gray-700">
          Continue with Google
        </span>
      </button>
    </div>
  );
};

export default GoogleButton;
