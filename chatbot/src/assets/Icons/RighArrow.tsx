
type Props = {
    size?:number;
    color?:string;
}

const RighArrow = ({size=12, color}: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.91667 13.9584L8.375 7.50002L1.91667 1.04169" 
stroke={color?color:"black"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  )
}

export default RighArrow