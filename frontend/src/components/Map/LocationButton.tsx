import React, { useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';

interface LocationButtonProps {
  onLocationFound: (location: { lat: number; lng: number; accuracy: number }) => void;
  onError: (errorMessage: string) => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  onLocationFound,
  onError,
}) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = position.coords;
        onLocationFound({
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 50,
        });
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Unable to determine your location. Please check your browser permissions.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        onError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <button
      onClick={handleLocate}
      disabled={isLocating}
      title="My Location (Browser Geolocation)"
      className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#3B82F6] hover:bg-white shadow-sm transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
    >
      {isLocating ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3B82F6]" />
      ) : (
        <Navigation className="w-3.5 h-3.5" />
      )}
    </button>
  );
};
