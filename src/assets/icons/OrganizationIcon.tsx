import React from 'react';
import organizationIcon from '../images/Ellipse 1.png';
import { useOrg } from '../../context/OrgContext';

type Props = {
  width?: number;
  height?: number;
};

const OrganizationIcon: React.FC<Props> = ({ width = 10, height = 10 }) => {
  const { orgData } = useOrg();
  

  return (
    <div>
      {orgData?.orgImg ? (
        <img
          src={orgData?.orgImg}
          className={`w-${width} h-${height} shadow-xl p-1 bg-[#e9f3fc] rounded-full object-cover`}
          alt="Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <img
          src={organizationIcon}
          className={`w-${width} h-${height} rounded-full object-cover`}
          alt="Default Organization Logo"
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  );
};

export default OrganizationIcon;
