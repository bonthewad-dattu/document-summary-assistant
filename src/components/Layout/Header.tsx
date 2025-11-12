import React from 'react';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-300 bg-white bg-opacity-80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 select-none">
          Document Summary Assistant
        </h1>
        <nav>
          {/* Placeholder for future nav links */}
          <ul className="flex space-x-6 text-gray-700 text-sm font-semibold select-none">
            {/* Add nav link items here if needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
