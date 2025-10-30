
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TravelInputForm } from './components/TravelInputForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Itinerary, UserInput, GroundingChunk } from './types';
import { generateTravelPlan } from './services/geminiService';
import { useGeolocation } from './hooks/useGeolocation';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    destination: '日本东京, 5天4晚自由行',
    flightPlan: '5月1日 08:00 从北京出发, 12:00 抵达东京成田机场, 航班号 CA123. 5月5日 18:00 从东京成田机场返回, 航班号 CA124.',
    accommodation: '新宿格拉斯丽酒店 (Hotel Gracery Shinjuku)',
    transportation: '计划购买东京地铁通票和JR山手线单次票',
    savedPlaces: '一兰拉面 (新宿中央东口店), 筑地市场, 秋叶原 Gachapon 会馆',
    attractions: '浅草寺, 晴空塔 (Tokyo Skytree), 明治神宫, 涩谷十字路口',
  });
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  const location = useGeolocation();
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  useEffect(() => {
    if (location.error) {
        setGeolocationError(`Could not get location: ${location.error.message}. Using a general context.`);
    }
  }, [location.error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setIsEditing(false);

    try {
      const result = await generateTravelPlan(userInput, location.latitude, location.longitude);
      if (result.itinerary) {
        setItinerary(result.itinerary);
        setGroundingChunks(result.groundingChunks);
      } else {
        throw new Error("The generated plan was empty.");
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setIsEditing(true); // Go back to editing on error
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, location.latitude, location.longitude]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-69px)]">
        <div className={`transition-all duration-500 ${isEditing ? 'block' : 'hidden lg:block'}`}>
          <TravelInputForm
            userInput={userInput}
            setUserInput={setUserInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            geolocationError={geolocationError}
          />
        </div>
        <div className={`h-full overflow-y-auto transition-all duration-500 ${isEditing ? 'hidden lg:block' : 'block'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <ItineraryDisplay 
              itinerary={itinerary} 
              groundingChunks={groundingChunks}
              onEdit={handleEdit} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
