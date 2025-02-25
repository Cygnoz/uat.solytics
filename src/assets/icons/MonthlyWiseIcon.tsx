
type Props = {
    size?:number;
}

const MonthlyWiseIcon = ({size=24}: Props) => {
  return (
<svg width={size} height={size} viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 22C0.447715 22 0 21.5523 0 21V1C0 0.447716 0.447715 0 1 0H6.33084C6.75475 0 7.13261 0.267287 7.27377 0.667011L11.5493 12.7742C11.8625 13.661 13.1153 13.6644 13.4334 12.7794L17.7877 0.661831C17.9303 0.264787 18.3068 0 18.7287 0H24C24.5523 0 25 0.447715 25 1V21C25 21.5523 24.5523 22 24 22H21.6741C21.1197 22 20.6712 21.5491 20.6741 20.9947L20.7337 9.72608C20.7396 8.60288 19.1747 8.32467 18.7931 9.3811L14.4741 21.3397C14.331 21.7359 13.9549 22 13.5336 22H11.3421C10.9193 22 10.5421 21.7341 10.4002 21.3358L6.17761 9.49119C5.80065 8.43381 4.23567 8.70442 4.23567 9.82698V21C4.23567 21.5523 3.78795 22 3.23567 22H1Z" fill="url(#paint0_linear_1068_185)"/>
<defs>
<linearGradient id="paint0_linear_1068_185" x1="19.084" y1="-7.06749e-07" x2="5.91604" y2="22" gradientUnits="userSpaceOnUse">
<stop stop-color="#9FC5EB"/>
<stop offset="1" stop-color="#7EAEDE"/>
</linearGradient>
</defs>
</svg>
  )
}

export default MonthlyWiseIcon