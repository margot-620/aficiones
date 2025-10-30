
import React from 'react';

const messages = [
  "Consulting world maps...",
  "Optimizing your route...",
  "Packing virtual bags...",
  "Checking for traffic on the information superhighway...",
  "Aligning the stars for a perfect trip...",
  "Finding the best photo spots...",
  "Translating local greetings...",
];

export const LoadingSpinner: React.FC = () => {
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg text-gray-300 font-medium">{message}</p>
    </div>
  );
};
