
type Props = {
    size?:number;
}

const StarVectorIcon = ({size=28}: Props) => {
  return (
<svg width={size} height={size} viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.4167 0H3.58333C2.025 0 0.75 1.275 0.75 2.83333V22.6667C0.75 24.225 2.025 25.5 3.58333 25.5H9.25L13.5 29.75L17.75 25.5H23.4167C24.975 25.5 26.25 24.225 26.25 22.6667V2.83333C26.25 1.275 24.975 0 23.4167 0ZM16.1633 15.4133L13.5 21.25L10.8367 15.4133L5 12.75L10.8367 10.0867L13.5 4.25L16.1633 10.0867L22 12.75L16.1633 15.4133Z" fill="white"/>
</svg>
  )
}

export default StarVectorIcon