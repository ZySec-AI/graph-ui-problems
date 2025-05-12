import { useTheme } from "../contexts/ThemeContext";

const ControlPanel = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`absolute right-4 bottom-4 space-y-2 rounded p-2 shadow-md ${
        isDark
          ? "border border-gray-700 bg-gray-800 text-white"
          : "border border-gray-200 bg-white text-gray-800"
      }`}
    >
      <p
        className={`text-md border-b pb-1 font-medium sm:text-lg ${
          isDark
            ? "border-gray-600 text-gray-200"
            : "border-gray-200 text-gray-700"
        }`}
      >
        Control
      </p>

      <div className="sm:text-md text-sm">
        <p>🖱️ Drag: Move nodes</p>
        <p>🔍 Scroll: Zoom in/out</p>
        <p>🖐️ Drag background: Pan</p>
        <p>👆 Click node: See details</p>
      </div>
    </div>
  );
};

export default ControlPanel;
