type Props = { isRead: boolean };

const TickMark = ({ isRead }: Props) => {
  return (
    <div className="space-x-2">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* First tick */}
        <path
          d="M4 12L8 16L16 8"
          stroke={isRead ? "#0077B6" : "#B3E5FC"} // Lighter blue for unread
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Second tick (Only visible when read) */}
        {isRead && (
          <path
            d="M7 12L11 16L19 8"
            stroke="#008000" // Green for read
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
};

export default TickMark;
