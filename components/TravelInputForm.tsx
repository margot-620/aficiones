import React, { useState } from 'react';
import { UserInput } from '../types';
import { PlaneIcon, HotelIcon, BusIcon, ShoppingBagIcon, LandmarkIcon, MapPinIcon, ImportIcon, ClipboardIcon } from './icons';

interface TravelInputFormProps {
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  geolocationError: string | null;
}

const InputField: React.FC<{
  id: keyof UserInput;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon: React.ReactNode;
  onImport?: () => void;
}> = ({ id, label, placeholder, value, onChange, icon, onImport }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <label htmlFor={id} className="flex items-center gap-2 text-lg font-semibold text-gray-200">
        {icon}
        {label}
      </label>
      {onImport && (
         <button type="button" onClick={onImport} className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 font-semibold px-2 py-1 rounded-md hover:bg-gray-700/50 transition-colors">
            <ImportIcon className="w-4 h-4" />
            Import
         </button>
      )}
    </div>
    <textarea
      id={id}
      name={id}
      rows={3}
      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors placeholder-gray-400"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export const TravelInputForm: React.FC<TravelInputFormProps> = ({
  userInput,
  setUserInput,
  onSubmit,
  isLoading,
  error,
  geolocationError,
}) => {
  const [importUrl, setImportUrl] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImport = (field: keyof UserInput, data: string) => {
    setUserInput(prev => ({ ...prev, [field]: prev[field] ? `${prev[field]}\n${data}`.trim() : data }));
  };

  const handleUrlImport = () => {
    if(!importUrl) return;
    // This is a simulation. In a real app, you would parse the URL and fetch data.
    const simulatedData = `
- Hotel from Booking.com: Park Hyatt Tokyo
- Restaurant from Google Maps: Sushi Jiro Roppongi
- Attraction from a travel blog: Ghibli Museum (requires reservation)
    `.trim();
    alert(`Simulating import from: ${importUrl}\n(This is a demo, actual data is not fetched)`);
    setUserInput(prev => ({
        ...prev,
        accommodation: prev.accommodation ? `${prev.accommodation}\nPark Hyatt Tokyo` : 'Park Hyatt Tokyo',
        savedPlaces: prev.savedPlaces ? `${prev.savedPlaces}\nSushi Jiro Roppongi` : 'Sushi Jiro Roppongi',
        attractions: prev.attractions ? `${prev.attractions}\nGhibli Museum` : 'Ghibli Museum',
    }));
    setImportUrl('');
  };

  return (
    <div className="h-full bg-gray-800 p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-6">Your Travel Details</h2>
      {geolocationError && <p className="text-sm text-yellow-400 mb-4">{geolocationError}</p>}
      
      <div className="mb-6">
        <label htmlFor="import-url" className="flex items-center gap-2 text-lg font-semibold text-gray-200 mb-2">
            <ClipboardIcon className="w-5 h-5 text-teal-400" />
            Import from URL
        </label>
        <div className="flex gap-2">
            <input 
                type="text" 
                id="import-url"
                placeholder="Paste Google Maps, Booking.com link..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors placeholder-gray-400"
            />
            <button 
                type="button" 
                onClick={handleUrlImport}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Import
            </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2">
        <InputField
          id="destination"
          label="旅行目的地"
          icon={<MapPinIcon className="w-5 h-5 text-teal-400" />}
          placeholder="例如: 日本东京"
          value={userInput.destination}
          onChange={handleInputChange}
        />
        <InputField
          id="flightPlan"
          label="航班计划"
          icon={<PlaneIcon className="w-5 h-5 text-teal-400" />}
          placeholder="例如: 5月1日 08:00 从北京出发, 12:00 抵达东京成田机场, 航班号 CA123"
          value={userInput.flightPlan}
          onChange={handleInputChange}
          onImport={() => handleImport('flightPlan', 'Airline Confirmation: Flight NH964, HND to PEK, May 6, 17:20')}
        />
        <InputField
          id="accommodation"
          label="住宿地点"
          icon={<HotelIcon className="w-5 h-5 text-teal-400" />}
          placeholder="例如: 新宿格拉斯丽酒店, 地址..."
          value={userInput.accommodation}
          onChange={handleInputChange}
          onImport={() => handleImport('accommodation', 'Booking.com Confirmation #12345: The Ritz-Carlton, Tokyo')}
        />
        <InputField
          id="transportation"
          label="交通方式计划"
          icon={<BusIcon className="w-5 h-5 text-teal-400" />}
          placeholder="例如: 计划购买Suica卡, 主要使用地铁和JR线"
          value={userInput.transportation}
          onChange={handleInputChange}
        />
        <InputField
          id="savedPlaces"
          label="收藏的店铺/地点"
          icon={<ShoppingBagIcon className="w-5 h-5 text-teal-400" />}
          placeholder="例如: 筑地市场的寿司大, 秋叶原的Animate总店"
          value={userInput.savedPlaces}
          onChange={handleInputChange}
          onImport={() => handleImport('savedPlaces', 'Restaurant Reservation: Narisawa, 7:00 PM')}
        />
        <InputField
          id="attractions"
          label="标记的当地景点"
          icon={<LandmarkIcon className="w-5 h-5 text-teal-400" />}
          placeholder="例如: 浅草寺, 东京塔, 吉卜力美术馆 (需要预约)"
          value={userInput.attractions}
          onChange={handleInputChange}
        />
      </form>
      <div className="mt-6 pt-6 border-t border-gray-700">
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
        >
          {isLoading ? 'Generating Plan...' : 'Generate Travel Plan'}
        </button>
      </div>
    </div>
  );
};