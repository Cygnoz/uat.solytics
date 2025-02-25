import No_Data_found from "../../assets/images/NO_DATA.png";

type Props = {
  text?: string;
  textSize?: "xs" |"md"| "sm" | "lg" | "xl" | "2xl" | "3xl";
  imgSize?: number;
  parentHeight?: string; // should be passed with px
};

function NoRecords({ text = "No Records Found!", textSize = "lg", imgSize = 80, parentHeight }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${parentHeight ? `h-[${parentHeight}]` : ""}`}
      style={{ height: parentHeight }}
    >
      <img src={No_Data_found} alt="No Data Found" width={imgSize} />
      <p className={`font-bold text-red-700 ${textSize ? `text-${textSize}` : ""}`}>{text}</p>
    </div>
  );
}

export default NoRecords;
