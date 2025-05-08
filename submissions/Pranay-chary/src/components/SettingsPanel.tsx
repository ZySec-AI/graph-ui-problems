import React from 'react';
import { toPng } from 'html-to-image';

interface GraphSettings {
  showLabels: boolean;
  showIcons: boolean;
  layout: 'horizontal' | 'vertical' | 'radial';
  nodePadding: number;
  nodeSpacing: number;
  zoomLevel: number;
}

interface SettingsPanelProps {
  isDarkMode: boolean;
  onThemeChange: () => void;
  settings: GraphSettings;
  onSettingsChange: (settings: Partial<GraphSettings>) => void;
  onExportImage?: () => void;
  onExportData?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isDarkMode,
  onThemeChange,
  settings,
  onSettingsChange,
  onExportImage,
  onExportData
}) => {
  const handleNumberInput = (key: keyof GraphSettings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onSettingsChange({ [key]: numValue });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold dark:text-white">Settings</h2>
      </div>
      <div className="p-6 space-y-6">
        {/* Theme Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium dark:text-white">Theme</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Dark Mode</span>
            <button
              onClick={onThemeChange}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{
                backgroundColor: isDarkMode ? '#3B82F6' : '#E5E7EB'
              }}
            >
              <span 
                className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} 
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
              />
            </button>
          </div>
        </div>

        {/* Graph Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium dark:text-white">Graph Display</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Show Labels</span>
              <button
                onClick={() => onSettingsChange({ showLabels: !settings.showLabels })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showLabels ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`${settings.showLabels ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Show Icons</span>
              <button
                onClick={() => onSettingsChange({ showIcons: !settings.showIcons })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showIcons ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span className={`${settings.showIcons ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </button>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium dark:text-white">Layout</h3>
          <div className="space-y-4">
            <select
              value={settings.layout}
              onChange={(e) => onSettingsChange({ layout: e.target.value as GraphSettings['layout'] })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="radial">Radial</option>
            </select>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Node Padding</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={settings.nodePadding}
                  onChange={(e) => handleNumberInput('nodePadding', e.target.value)}
                  className="w-full mt-1"
                />
                <div className="text-right text-sm text-gray-500">{settings.nodePadding}px</div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Node Spacing</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={settings.nodeSpacing}
                  onChange={(e) => handleNumberInput('nodeSpacing', e.target.value)}
                  className="w-full mt-1"
                />
                <div className="text-right text-sm text-gray-500">{settings.nodeSpacing}px</div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="text-md font-medium dark:text-white">Export</h3>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <button
              onClick={onExportImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span role="img" aria-label="download">📸</span>
              <span>Export as PNG</span>
            </button>
            <button
              onClick={onExportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span role="img" aria-label="json">📄</span>
              <span>Export as JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
