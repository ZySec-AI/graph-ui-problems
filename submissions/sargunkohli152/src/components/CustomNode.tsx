import React from 'react';
import { Handle, Position, type NodeProps, type Node } from 'reactflow';
import clsx from 'clsx';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { useNodePopupStore } from '../store/nodePopupStore';
import { useNodeHighlightStore } from '../store/nodeHighlightStore';

// Mapping of node types to their corresponding Material-UI icons
const typeToIcon = {
  Process: <SettingsOutlinedIcon fontSize="large" />,
  User: <PersonOutlineOutlinedIcon fontSize="large" />,
  Account: <AccountBalanceOutlinedIcon fontSize="large" />,
  Transaction: <ReceiptOutlinedIcon fontSize="large" />,
  Bank: <AccountBalanceWalletOutlinedIcon fontSize="large" />,
  Document: <FolderOutlinedIcon fontSize="large" />,
  Policy: <PolicyOutlinedIcon fontSize="large" />,
  Infrastructure: <ApartmentOutlinedIcon fontSize="large" />,
  Group: <GroupOutlinedIcon fontSize="large" />,
  Patient: <MonitorHeartOutlinedIcon fontSize="large" />,
  Treatment: <HealingOutlinedIcon fontSize="large" />,
  Employee: <PersonOutlineOutlinedIcon fontSize="large" />,
  Server: <StorageOutlinedIcon fontSize="large" />,
  Router: <RouterOutlinedIcon fontSize="large" />,
  Machine: <PrecisionManufacturingOutlinedIcon fontSize="large" />,
  Product: <CategoryOutlinedIcon fontSize="large" />,
  Operator: <PersonOutlineOutlinedIcon fontSize="large" />,
  Supplier: <PersonOutlineOutlinedIcon fontSize="large" />,
  Category: <CategoryOutlinedIcon fontSize="large" />,
  Store: <ApartmentOutlinedIcon fontSize="large" />,
};

// Custom node component that renders graph nodes with dynamic styling, icons, and interactive features
const CustomNode: React.FC<NodeProps> = ({ data, id }) => {
  // State management for node selection and highlighting
  const { setSelectedNode, selectedNodeId } = useNodePopupStore();
  const { highlightedNodeIds } = useNodeHighlightStore();

  // Extract node properties with defaults
  const {
    label = '',
    type = '',
    group = '',
    properties = {},
    color = '#888',
    shape = 'rectangle',
  } = data;

  // Node state flags
  const isCircle = shape === 'circle';
  const isSelected = selectedNodeId === id;
  const isHighlighted = highlightedNodeIds.has(id);

  // Get appropriate icon based on node type, fallback to user icon
  const icon = typeToIcon[type as keyof typeof typeToIcon] || (
    <PersonOutlineOutlinedIcon fontSize="large" />
  );

  const handleClick = () => {
    const node: Partial<Node> = {
      id,
      data,
    };
    setSelectedNode(node as Node);
  };

  return (
    <div
      className={clsx(
        'relative group flex flex-col items-center cursor-pointer',
        isCircle ? 'w-[200px] h-[200px]' : 'w-[200px] h-[200px]',
        isHighlighted && 'animate-pulse'
      )}
      onClick={handleClick}
      style={{ '--node-color': color } as React.CSSProperties}
    >
      {/* Main node container with dynamic styling based on state */}
      <div
        className={clsx(
          'relative p-3 shadow-md flex flex-col items-center justify-center text-sm font-medium group-hover:bg-white transition-all duration-300',
          isCircle ? 'rounded-full w-[200px] h-[200px]' : 'rounded-md w-[200px] h-[200px]',
          isSelected && 'ring-2 ring-offset-4 ring-[var(--node-color)]',
          isHighlighted && 'ring-4 ring-offset-4'
        )}
        style={{
          border: `${isSelected || isHighlighted ? '2px' : '1px'} solid ${color}`,
          backgroundColor: isSelected || isHighlighted ? `white` : '',
          boxShadow: isHighlighted ? `0 0 8px ${color}, 0 0 15px ${color}` : undefined,
        }}
      >
        {/* Background layer with node color */}
        <div
          className={clsx(
            `absolute`,
            isCircle ? 'rounded-full w-[200px] h-[200px]' : 'rounded-md w-[200px] h-[200px]'
          )}
          style={{
            backgroundColor: color,
            opacity: isHighlighted ? 0.25 : 0.2,
            zIndex: -1,
            boxShadow: isHighlighted ? `0 0 12px ${color}` : undefined,
          }}
        />

        {/* Node type icon with dynamic styling */}
        <div
          className={clsx(
            'flex items-center justify-center mb-2 shadow',
            'w-12 h-12 rounded-full text-white text-lg',
            'border-4 p-4'
          )}
          style={{ backgroundColor: color, borderColor: color, marginTop: '-1.5rem' }}
        >
          {icon}
        </div>

        {/* Node label and type information */}
        <div
          className={`text-lg font-semibold text-gray-900 dark:group-hover:text-gray-900 text-center ${
            !isHighlighted && !isSelected && 'dark:text-gray-300'
          }`}
        >
          {label}
        </div>
        {type && (
          <span
            className={`px-1 py-0.5 text-xs font-medium mb-1 w-full text-center text-gray-900 ${
              !isHighlighted && !isSelected && 'dark:text-gray-300'
            } dark:group-hover:text-gray-900`}
          >
            Type of node: {type}
          </span>
        )}

        {/* Group tag with hover effects */}
        {group && (
          <span
            className="px-4 py-1 mt-2 rounded-full text-xs text-gray-900 font-medium mb-1 bg-white group-hover:bg-[var(--node-color)] group-hover:text-[#fff]"
            style={{
              backgroundColor: `${isSelected ? 'var(--node-color)' : ''}`,
              color: `${isSelected ? 'white' : ''}`,
            }}
          >
            {group}
          </span>
        )}
      </div>

      {/* Properties tooltip shown on hover */}
      {properties && selectedNodeId !== id && (
        <div className="absolute z-10 hidden group-hover:flex flex-col bg-white text-gray-700 text-md border border-gray-200 rounded-md p-2 shadow-lg top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
          {Object.entries(properties).map(([key, value]) => (
            <div key={key} className="px-2 py-0.5">
              <span className="font-semibold">{key}:</span> {String(value)}
            </div>
          ))}
        </div>
      )}

      {/* Connection handles for graph edges */}
      <Handle
        type="target"
        position={Position.Top}
        style={isCircle ? { left: '50%', top: -3, transform: 'translateX(-50%)' } : undefined}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={isCircle ? { left: '50%', bottom: -3, transform: 'translateX(-50%)' } : undefined}
      />
    </div>
  );
};

export default CustomNode;
