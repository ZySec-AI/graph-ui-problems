import { type FC } from "react";
import type { Node } from "../types/graph";
import { useTheme } from "../contexts/ThemeContext";

type NodeDetailsProps = {
  nodeDetails: Node | null;
  onClose: () => void;
};

const NodeDetails: FC<NodeDetailsProps> = ({ nodeDetails, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`overflow-y-auto border-l transition-all duration-300 ${
        nodeDetails ? "w-80 translate-x-0" : "w-0 translate-x-full"
      } ${
        isDark
          ? "border-gray-700 bg-gray-800 text-white"
          : "border-gray-200 bg-white text-gray-800"
      }`}
    >
      {nodeDetails && (
        <div className="flex flex-col gap-5 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Node Details</h2>
            <button
              onClick={onClose}
              className={`${
                isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center">
            <div
              className="mr-2 h-6 w-6 rounded-full"
              style={{ backgroundColor: nodeDetails.style?.color || "#999" }}
            ></div>
            <span className="text-lg">{nodeDetails.label}</span>
          </div>

          <div>
            <div
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Type
            </div>
            <div>{nodeDetails.type}</div>
          </div>

          {nodeDetails.group && (
            <div>
              <div
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Group
              </div>
              <div>{nodeDetails.group}</div>
            </div>
          )}

          {nodeDetails.properties &&
            Object.keys(nodeDetails.properties).length > 0 && (
              <div>
                <div
                  className={`mb-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Properties
                </div>
                <div
                  className={`rounded p-3 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  {Object.entries(nodeDetails.properties).map(
                    ([key, value]) => (
                      <div key={key} className="mb-1">
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default NodeDetails;
