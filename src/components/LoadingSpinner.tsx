'use client';

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showMessage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Preparing your quest...", 
  size = 'medium',
  showMessage = true 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="fixed inset-0 bg-[var(--bannerlord-custom-very-dark-brown)] bg-opacity-95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      {/* Medieval Loading Animation */}
      <div className="flex flex-col items-center space-y-6">
        {/* Spinning Shield/Emblem */}
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-[var(--bannerlord-custom-med-brown)] border-t-[var(--bannerlord-patch-brassy-gold)] rounded-full animate-spin`}>
            <div className="absolute inset-2 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="var(--bannerlord-custom-very-dark-brown)"
                className="w-6 h-6"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        {showMessage && (
          <div className="text-center">
            <h3 className={`${textSizeClasses[size]} font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-2 font-serif`}>
              {message}
            </h3>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Decorative Border */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[var(--bannerlord-patch-brassy-gold)] to-transparent opacity-50"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[var(--bannerlord-patch-brassy-gold)] rotate-45"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-[var(--bannerlord-patch-brassy-gold)] rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-[var(--bannerlord-patch-brassy-gold)] -rotate-12"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
