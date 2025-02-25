import { useLocation, useNavigate } from "react-router-dom";
import LeftArrow from '../../assets/icons/LeftArrow'; // Import your LeftArrow icon
import { useEffect, useRef } from "react";
type Props = {
  navigation?:string
};
const GoBackButton = ({navigation}: Props) => {
  const navigate = useNavigate();
  const location=useLocation()
  const currentPath= useRef<string | null>(null); // Store previous path

    useEffect(() => {
      currentPath.current = location.pathname; // Update previous path before navigating
    }, [location.pathname]);

  const goBack = () => {
   if(navigation){
    navigate(navigation)
   }else if(currentPath.current?.startsWith("/message")){
      navigate('/main') // Navigate to the previous page if history exist 
   }else{
    navigate(-1);
   }
  };

  return (
    <div 
    onClick={goBack} 
    className="text-3xl cursor-pointer sticky top-0  z-50 py-3 bg-white"
  >
    <LeftArrow size={16} />
  </div>
  
  );
};

export default GoBackButton;
