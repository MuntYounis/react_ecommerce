import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">My Website</h2>
          <p className="text-gray-400">React Website</p>
        </div>
      </div>
    </footer>
  );
}
