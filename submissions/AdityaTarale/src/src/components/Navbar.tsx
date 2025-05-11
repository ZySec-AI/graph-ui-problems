import React, { type FC } from "react";

type NavbarProps = {
  meta?: { title: string; description: string };
  onFileUpload: React.ChangeEventHandler<HTMLInputElement>;
};

const Navbar: FC<NavbarProps> = ({ onFileUpload, meta }) => {
  return (
    <header className="bg-blue-700 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white md:text-3xl">
          Graph Crafter
        </h1>

        <div className="flex items-center justify-between gap-4">
          <label className="cursor-pointer rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-400">
            Upload JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={onFileUpload}
            />
          </label>
        </div>
      </div>
      {meta && (
        <p className="mt-1 text-sm text-gray-200 sm:text-base">
          {meta.title} - {meta.description}
        </p>
      )}
    </header>
  );
};

export default Navbar;
