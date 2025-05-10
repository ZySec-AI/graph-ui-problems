import React from 'react'
import { Handle, Position } from '@xyflow/react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#1e293b',
    fontSize: '0.875rem',
    padding: '10px',
    whiteSpace: 'pre-line',
  },
});


const CustomNode = ({ data, style }) => {

  const handleClick = () => {
    console.log("Node clicked:", data.label);
  }
  const tooltip = Object.entries(data.properties)
  .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
  .join('\n');

  return (
     <CustomTooltip title={tooltip} placement="top">
      <button style={style} onClick={handleClick} className="cursor-pointer">
        <div className='flex flex-col justify-center items-center gap-0.5'>
         
          <div className='text-xs opacity-70 font-semibold'>
            {data.group}
          </div>
          
          <div className='font-normal'>
            {data.label}
          </div>
        </div>
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </button>
    </CustomTooltip>
  )
}

export default CustomNode