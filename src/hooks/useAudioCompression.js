import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { useNetworkInfo } from './useNetworkInfo'; // Import the new useNetworkInfo hook

// Mapping different bitrates based on network strength (example URLs; you can update as needed)
const audioVariants = {
  '4g': 'https://murf.ai/share/m1g2w88x',   // High-quality audio for 4G
  '3g': 'https://murf.ai/share/m1p4tsge',   // Medium-quality audio for 3G
  '2g': 'https://murf.ai/share/m1p4tsge',   // Low-quality audio for 2G
  'slow-2g': 'https://murf.ai/share/m1p4tsge' // Lowest quality for slow connections
};

export const useAudioCompression = (defaultUrl) => {
  const [audioSrc, setAudioSrc] = useState(defaultUrl);
  const networkInfo = useNetworkInfo(); // Use the new hook
  const [howlInstance, setHowlInstance] = useState(null);

  useEffect(() => {
    // Check if there is a network connection first
    if (!networkInfo.isOnline) {
      console.log('No network connection');
      setAudioSrc(defaultUrl); // Fall back to the default URL if offline
      return;
    }

    // Determine audio variant based on network type
    const compressedUrl = audioVariants[networkInfo.effectiveType] || defaultUrl;
    setAudioSrc(compressedUrl);

    // Clean up the previous Howl instance to avoid memory leaks
    if (howlInstance) {
      howlInstance.unload();
    }

    // Create a new Howl instance with the appropriate audio file
    const newHowl = new Howl({
      src: [compressedUrl],
      html5: true,  // Ensure the sound is loaded using HTML5 Audio (good for mobile)
    });

    setHowlInstance(newHowl);
  }, [networkInfo.effectiveType, networkInfo.isOnline]); // Depend on network type and online status

  const playAudio = () => {
    howlInstance && howlInstance.play();
  };

  const stopAudio = () => {
    howlInstance && howlInstance.stop();
  };

  return {
    playAudio,
    stopAudio,
    currentAudioSrc: audioSrc,
  };
};
