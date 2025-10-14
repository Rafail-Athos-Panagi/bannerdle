'use client';

import { useState } from 'react';

export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('This is a test error to demonstrate the error page functionality!');
  }

  return (
    <div className="min-h-screen bg-[var(--bannerlord-custom-dark-brown)] flex items-center justify-center">
      <div className="text-center text-[var(--bannerlord-custom-light-cream)]">
        <h1 className="text-2xl font-bold mb-4">Error Page Test</h1>
        <p className="mb-4">Click the button below to trigger an error and see the error page.</p>
        <button
          onClick={() => setShouldError(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Trigger Error
        </button>
      </div>
    </div>
  );
}
