import React, { type FC, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type NavbarProps = {
  meta?: { title: string; description: string };
  onFileUpload: React.ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
};

const NavButton: FC<{
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`rounded px-4 py-2 text-white transition ${className}`}
  >
    {children}
  </button>
);

const UploadButton: FC<{
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onComplete?: () => void;
}> = ({ onChange, onComplete }) => (
  <label className="cursor-pointer rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500">
    Upload JSON
    <input
      type="file"
      className="hidden"
      onChange={(e) => {
        onChange(e);
        if (onComplete) onComplete();
      }}
    />
  </label>
);

const Navbar: FC<NavbarProps> = ({ onFileUpload, onReset, meta }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-blue-700 p-4 dark:bg-gray-800">
      {/* Desktop View */}
      <div className="hidden md:flex md:items-center md:justify-between">
        <h1 className="text-xl font-bold text-white md:text-3xl">
          Graph Crafter
        </h1>

        <div className="flex items-center justify-between gap-4">
          <ThemeToggle />
          <UploadButton onChange={onFileUpload} />
          <NavButton
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Reset to Sample
          </NavButton>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex items-center justify-between md:hidden">
        <h1 className="text-lg font-bold text-white">Graph Crafter</h1>

        <button
          className="text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
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
          ) : (
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="mt-4 flex flex-col space-y-3 md:hidden">
          <div className="flex items-center justify-between">
            <span className="text-white">Theme</span>
            <ThemeToggle />
          </div>

          <UploadButton onChange={onFileUpload} onComplete={closeMenu} />

          <NavButton
            onClick={() => {
              onReset();
              closeMenu();
            }}
            className="bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Reset to Sample
          </NavButton>
        </div>
      )}

      {meta && (
        <p className="mt-2 text-sm text-gray-200 sm:text-base md:mt-1">
          {meta.title} - {meta.description}
        </p>
      )}
    </header>
  );
};

export default Navbar;
