
type Props = {
    size?:number;
    color?:string;
}

const LeftArrow = ({size=12, color}: Props) => {
  return (
<svg width={size} height={size} viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.33333 2.16671L1.5 8.00004L7.33333 13.8334" 
stroke={color?color:"#177BDA"} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  )
}

export default LeftArrow