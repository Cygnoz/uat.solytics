type Props = {
  color?: string;
  size?: number;
  isHalf?: boolean;
  filled?: boolean;
  index?: number;
};

const Star = ({ color = "#FFCC00", size = 24, isHalf = false, filled = false, index = 0 }: Props) => {
  const gradientId = `halfStar${index}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="50%" stopColor={color} />
          <stop offset="50%" stopColor="#E0E0E0" />
        </linearGradient>
      </defs>
      <path
        d="M9 1.5L11.3175 6.195L16.5 6.9525L12.75 10.605L13.635 15.765L9 13.3275L4.365 15.765L5.25 10.605L1.5 6.9525L6.6825 6.195L9 1.5Z"
        fill={filled ? color : isHalf ? `url(#${gradientId})` : "#dad8d8"}
        // stroke={color}
        // strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Star;
