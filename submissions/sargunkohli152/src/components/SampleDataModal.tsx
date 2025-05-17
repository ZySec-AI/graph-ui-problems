// SampleDataModal component that provides a selection interface for loading predefined graph samples
// Displays a grid of sample options with icons and handles loading states and errors
import React, { useState } from 'react';
import { useSampleModalStore } from '../store/modalStore';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import type { GraphData } from '../types/graph';

// Predefined sample data files and their corresponding display names and icons
const SAMPLE_FILES = [
  'itNetwork.json',
  'hrStructure.json',
  'manufacturingProcess.json',
  'healthcareSystem.json',
  'retailInventory.json',
  'financialTransactions.json',
];

const SAMPLE_NAMES = [
  'IT Network',
  'HR Structure',
  'Manufacturing Process',
  'Healthcare System',
  'Retail Inventory',
  'Financial Transactions',
];

const SAMPLE_ICONS = [
  CodeOutlinedIcon,
  PermIdentityOutlinedIcon,
  PrecisionManufacturingOutlinedIcon,
  LocalHospitalOutlinedIcon,
  Inventory2OutlinedIcon,
  AttachMoneyOutlinedIcon,
];

interface SampleDataModalProps {
  onLoadGraph: (data: GraphData) => void; // Callback for successful graph loading
  onError: (msg: string) => void; // Error handling callback
}

const SampleDataModal: React.FC<SampleDataModalProps> = ({ onLoadGraph, onError }) => {
  // Modal state management
  const { isOpen, close } = useSampleModalStore();
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null); // Tracks which sample is currently loading
  const [error, setError] = useState<string | null>(null); // Error state for failed loads

  if (!isOpen) return null;

  // Handle sample selection and data loading
  const handleSelectSample = async (idx: number) => {
    setLoadingIdx(idx);
    setError(null);
    try {
      // Fetch and load the selected sample data
      const resp = await fetch(`/data/${SAMPLE_FILES[idx]}`);
      if (!resp.ok) throw new Error('Failed to load sample data');
      const data = await resp.json();
      onLoadGraph(data);
      close();
    } catch (e: any) {
      // Handle and propagate errors
      const errorMsg = e.message || 'Error loading sample data';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setLoadingIdx(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal backdrop with blur effect */}
      <div className="absolute inset-0 backdrop-blur-[4px] dark:bg-black/30" onClick={close}></div>

      {/* Modal content container */}
      <div className="relative bg-white/90 dark:bg-gray-900/95 rounded-lg shadow-2xl p-8 z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Select Sample Data
        </h3>

        {/* Sample data grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {SAMPLE_NAMES.map((name, idx) => {
            const Icon = SAMPLE_ICONS[idx];
            return (
              <button
                key={idx}
                onClick={() => handleSelectSample(idx)}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center transition-colors shadow-sm focus:outline-none relative"
                disabled={loadingIdx !== null}
              >
                {/* Sample icon and name */}
                <Icon className="mb-2 text-blue-500 dark:text-blue-400" fontSize="large" />
                <span className="font-medium text-gray-800 dark:text-gray-200">{name}</span>

                {/* Loading overlay */}
                {loadingIdx === idx && (
                  <span className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg text-blue-600 dark:text-blue-400 font-semibold">
                    Loading...
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Error message display */}
        {error && <div className="text-red-500 dark:text-red-400 mt-4">{error}</div>}

        {/* Cancel button */}
        <button
          onClick={close}
          className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SampleDataModal;
