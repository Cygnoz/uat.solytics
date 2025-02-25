
type Props = {
    size?:number;
    color?:string;
}

const SalesIcon = ({size=24, color}: Props) => {
  return (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_1068_161"  maskUnits="userSpaceOnUse" x="4" y="2" width="28" height="32">
    <path d="M30.75 11.6439C30.75 10.9352 30.3749 10.2794 29.764 9.92002L19.014 3.5965C18.3881 3.22832 17.6119 3.22832 16.986 3.59649L6.23596 9.92002C5.62508 10.2794 5.25 10.9352 5.25 11.6439V24.3561C5.25 25.0648 5.62508 25.7206 6.23596 26.08L16.986 32.4035C17.6119 32.7717 18.3881 32.7717 19.014 32.4035L29.764 26.08C30.3749 25.7206 30.75 25.0648 30.75 24.3561V11.6439Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    <path d="M18 16.5V22.5M24 13.5V22.5M12 19.5V22.5" stroke={color?color:"black"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </mask>
    <g mask="url(#mask0_1068_161)">
    <path d="M0 2C0 0.895431 0.895431 0 2 0H34C35.1046 0 36 0.895431 36 2V34C36 35.1046 35.1046 36 34 36H2C0.895431 36 0 35.1046 0 34V2Z" fill="url(#paint0_linear_1068_161)"/>
    </g>
    <defs>
    <linearGradient id="paint0_linear_1068_161" x1="33.4957" y1="-7.81967e-07" x2="2.50434" y2="36" gradientUnits="userSpaceOnUse">
    <stop stop-color="#0B3868"/>
    <stop offset="1" stop-color="#0073EB"/>
    </linearGradient>
    </defs>
    </svg>
    
  )
}

export default SalesIcon