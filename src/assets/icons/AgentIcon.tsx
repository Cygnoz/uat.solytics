import React from 'react';
import SaImage from "../../assets/FrameImages/SAImage.png";

type Props = {
  width?: number;
  height?: number;
  agentImg?:string
};

const AgentIcon: React.FC<Props> = ({ width = 10, height = 10,agentImg }) => {
  

  return (
    <div>
      {agentImg ? (
        <img
          src={agentImg}
          className={`w-${width} h-${height} shadow-xl p-1 bg-[#e9f3fc] rounded-full object-cover`}
          alt="Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <img
          src={SaImage}
          className={`w-${width} h-${height} shadow-xl p-1 bg-[#e9f3fc] rounded-full text-center object-cover`}
          alt="Default Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default AgentIcon;
