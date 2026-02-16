import React from 'react';
import { useAudioCompression } from '../hooks/useAudioCompression';
import { useNetworkInfo } from '../hooks/useNetworkInfo'; // Import the network hook

const AudioCompressor = ({ defaultUrl }) => {
  const { currentAudioSrc } = useAudioCompression(defaultUrl);
  const { effectiveType, downlink, rtt, isOnline } = useNetworkInfo(); // Destructure network properties

  // Define preferred bitrates based on network type
  const preferredBitrates = {
    '4g': '128 kbps',
    '3g': '64 kbps',
    '2g': '32 kbps',
    'slow-2g': '16 kbps',
    'unknown': 'Default bitrate',
  };

  // Determine the bitrate to display based on the effective network type
  const bitrateToDisplay = preferredBitrates[effectiveType] || preferredBitrates['unknown'];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">
        Network Status: <span className={isOnline ? 'text-green-500' : 'text-red-500'}>{isOnline ? 'Connected' : 'No Network Connection'}</span>
      </h4>
      {isOnline && (
        <div className="space-y-4">
          <h4 className="text-lg text-gray-700">
            <span className="font-medium">Network Type:</span> {effectiveType ? effectiveType.toUpperCase() : 'Unknown'}
          </h4>
          <h4 className="text-lg text-gray-700">
            <span className="font-medium">Estimated Bandwidth:</span> {downlink ? `${downlink} Mbps` : 'Unknown'}
          </h4>
          <h4 className="text-lg text-gray-700">
            <span className="font-medium">Estimated Latency (RTT):</span> {typeof rtt === 'number' ? `${rtt} ms` : 'Not Available'}
          </h4>
          <h4 className="text-lg text-gray-700">
            <span className="font-medium">Preferred Bitrate:</span> {bitrateToDisplay}
          </h4>
        </div>
      )}
    </div>
  );
};

export default AudioCompressor;
