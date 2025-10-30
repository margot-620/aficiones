
import React from 'react';
import { Itinerary, GroundingChunk, DayPlan, ScheduleItem } from '../types';
import { ShareIcon, EditIcon, AlertTriangleIcon, ClockIcon, BusIcon, InfoIcon, MapPinIcon, LinkIcon, CameraIcon } from './icons';

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
  groundingChunks: GroundingChunk[];
  onEdit: () => void;
}

const ScheduleItemCard: React.FC<{ item: ScheduleItem }> = ({ item }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700 transition-all hover:bg-gray-800 hover:border-teal-500/50">
        <div className="flex flex-col items-center justify-center mt-1">
            <ClockIcon className="w-5 h-5 text-gray-400"/>
            <p className="text-sm font-semibold text-teal-400 mt-1">{item.time}</p>
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-white">{item.activity}</h4>
            <p className="text-gray-300 mt-1">{item.description}</p>
            {item.transportation && (
                <div className="flex items-start gap-2 mt-2 text-sm text-gray-400">
                    <BusIcon className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                    <span>{item.transportation}</span>
                </div>
            )}
            {item.notes && (
                 <div className="flex items-start gap-2 mt-2 text-sm p-2 rounded-md bg-yellow-900/20 border border-yellow-500/30 text-yellow-300">
                    <AlertTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                    <span>{item.notes}</span>
                </div>
            )}
            {item.photoSuggestion && (
                <div className="flex items-start gap-2 mt-2 text-sm p-2 rounded-md bg-sky-900/30 border border-sky-500/30 text-sky-300">
                    <CameraIcon className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                    <span>{item.photoSuggestion}</span>
                </div>
            )}
        </div>
    </div>
);

const DayPlanCard: React.FC<{ dayPlan: DayPlan }> = ({ dayPlan }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-500/10 text-teal-400 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center">
                {dayPlan.day}
            </div>
            <h3 className="text-2xl font-bold text-white">{dayPlan.title}</h3>
        </div>
        <div className="space-y-4">
            {dayPlan.schedule.map((item, index) => (
                <ScheduleItemCard key={index} item={item} />
            ))}
        </div>
    </div>
);

const GroundingSources: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => {
    if (!chunks || chunks.length === 0) return null;

    const sources = chunks.flatMap(chunk => 
        chunk.maps ? [{ title: chunk.maps.title, uri: chunk.maps.uri }] : []
    );

    if(sources.length === 0) return null;

    return (
        <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2 mb-2"><LinkIcon className="w-5 h-5"/> Information Sources</h3>
            <ul className="list-disc list-inside space-y-1">
                {sources.map((source, index) => (
                    <li key={index}>
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 hover:underline underline-offset-2">
                           {source.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, groundingChunks, onEdit }) => {
  if (!itinerary) {
    return (
        <div className="text-center p-8 text-gray-400 flex flex-col items-center gap-4">
            <MapPinIcon className="w-16 h-16 text-gray-600"/>
            <h2 className="text-2xl font-bold text-gray-300">Welcome to the AI Travel Planner</h2>
            <p>Fill in your travel details on the left to generate your personalized itinerary.</p>
        </div>
    );
  }

  const handleShare = () => {
    alert('Shareable link copied to clipboard! (Simulation)');
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{itinerary.title}</h2>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            <ShareIcon className="w-5 h-5" /> Share
          </button>
          <button onClick={onEdit} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            <EditIcon className="w-5 h-5" /> Edit
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {itinerary.itinerary.map((dayPlan) => (
          <DayPlanCard key={dayPlan.day} dayPlan={dayPlan} />
        ))}
      </div>
      <GroundingSources chunks={groundingChunks} />
    </div>
  );
};