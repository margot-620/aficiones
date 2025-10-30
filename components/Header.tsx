
import React from 'react';
import { GlobeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GlobeIcon className="w-8 h-8 text-teal-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Travel Planner
          </h1>
        </div>
        <p className="text-gray-400 hidden md:block">Your smart itinerary generator</p>
      </div>
    </header>
  );
};
