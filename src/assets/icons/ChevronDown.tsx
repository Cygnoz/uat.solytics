import React from 'react';

type Props = {
  color?: string;
  size?: number;
  bold?:number;
  className?: string;
};

const ChevronDown: React.FC<Props> = ({ color,size,bold, className }) => {
  return (
    <div>
      <svg
        height={size ? size : 24}
        width={size ? size : 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M6 9L12 15L18 9"
          stroke={color}
          strokeWidth={bold||"2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChevronDown;
