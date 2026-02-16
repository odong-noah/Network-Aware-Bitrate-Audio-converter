import React from 'react';
import AudioCompressor from './components/AudioCompressor';
import AudioConverter from './components/AudioConverter';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-600">Network-Aware Audio Playback</h1>
      
      {/* Default high-quality audio file */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <AudioCompressor defaultUrl="https://murf.ai/share/m1g2w88x" />
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <AudioConverter />
      </div>
    </div>
  );
}

export default App;
