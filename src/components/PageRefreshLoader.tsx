'use client';

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PageRefreshLoaderProps {
  children: React.ReactNode;
  loadingMessage?: string;
}

const PageRefreshLoader: React.FC<PageRefreshLoaderProps> = ({ 
  children, 
  loadingMessage = "Refreshing your quest..." 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsRefreshing(true);
    };

    const handleLoad = () => {
      // Small delay to show loading state
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    };

    // Listen for page refresh/close events
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Show loading spinner during refresh
  if (isRefreshing) {
    return <LoadingSpinner message={loadingMessage} size="large" />;
  }

  return <>{children}</>;
};

export default PageRefreshLoader;
