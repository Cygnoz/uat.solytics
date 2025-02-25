
type Props = {
    size?:number;
}

const PlusIcon = ({size=24}: Props) => {
  return (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 13.7143H13.7143V24H10.2857V13.7143H0V10.2857H10.2857V0H13.7143V10.2857H24V13.7143Z" fill="white"/>
</svg>
  )
}

export default PlusIcon