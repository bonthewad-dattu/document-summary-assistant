import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 bg-opacity-70 backdrop-blur-sm py-6 mt-auto text-center text-sm text-gray-700 select-none">
      <div className="max-w-4xl mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} Document Summary Assistant. All rights reserved.
        </p>
        <p className="mt-1 text-gray-500 text-xs">
          Built with Next.js and TailwindCSS
        </p>
      </div>
    </footer>
  );
}
