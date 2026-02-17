const Logo = () => {
  return (
    <div className="h-[60px] w-[100px] flex items-center justify-center">
      <svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background Gradient */}
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE0B2" />
              <stop offset="100%" stopColor="#FFB74D" />
          </radialGradient>
          {/* Text Gradient */}
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D84315" />
            <stop offset="50%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
        </defs>

        {/* Circular Background */}
        <circle cx="220" cy="135" r="70" fill="url(#bgGradient)" />

        {/* Simple Bicycle Illustration */}
        {/* <g stroke="#333" strokeWidth="3" fill="none">
          <circle cx="110" cy="121" r="20" />
          <circle cx="170" cy="120" r="20" />
          <line x1="110" y1="150" x2="150" y2="120" />
          <line x1="150" y1="120" x2="190" y2="150" />
          <line x1="150" y1="120" x2="140" y2="90" />
          <line x1="140" y1="90" x2="165" y2="90" />
        </g> */}

        {/* MURUA Text */}
        {/* <text
          x="150"
          y="240"
          textAnchor="middle"
          fontSize="70"
          fontWeight="bold"
          fill="url(#textGradient)"
          fontFamily="Arial, sans-serif"
        >
          MURUA
        </text> */}

        {/* Tagline */}
        {/* <text
          x="150"
          y="270"
          textAnchor="middle"
          fontSize="28"
          fontWeight={"bold"}
          fill="#5D4037"
          fontFamily="Arial, sans-serif"
        >
          Value or nothing
        </text> */}
      </svg>
    </div>
  );
};

export default Logo;