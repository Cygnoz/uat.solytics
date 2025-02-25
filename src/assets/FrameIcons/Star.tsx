type Props = {
    color?:string
    size?:number
};
 
const Star = ({color='yellow',size=24}: Props) => {
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 18 18"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 1.5L11.3175 6.195L16.5 6.9525L12.75 10.605L13.635 15.765L9 13.3275L4.365 15.765L5.25 10.605L1.5 6.9525L6.6825 6.195L9 1.5Z"
          fill="#FFCC00"
          stroke="#FFCC00"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
};
 
export default Star;