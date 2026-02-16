import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const AudioConverter = () => {
  const [loaded, setLoaded] = useState(false);
  const [outputUrl, setOutputUrl] = useState(null);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef(null);

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
      }
    });

    try {
      await ffmpeg.load();
      setLoaded(true);
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
    }
  };

  const convertToMp3 = async (file) => {
    if (!loaded) {
      console.warn('FFmpeg is not loaded yet.');
      return;
    }

    const ffmpeg = ffmpegRef.current;

    try {
      await ffmpeg.writeFile('input.wav', await fetchFile(file));
      await ffmpeg.exec(['-i', 'input.wav', '-b:a', '96k', 'output.mp3']);
      const data = await ffmpeg.readFile('output.mp3');
      const blob = new Blob([data.buffer], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch (error) {
      console.error('Error during audio conversion:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      convertToMp3(file);
    }
  };

  // Cleanup Blob URL on component unmount or when a new file is converted
  useEffect(() => {
    return () => {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
      }
    };
  }, [outputUrl]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Audio Converter</h2>
      {!loaded ? (
        <button
          onClick={loadFFmpeg}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Load FFmpeg Core
        </button>
      ) : (
        <div>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="mb-4 block w-full border p-2 rounded"
          />
          {outputUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Converted Audio:</h3>
              <audio controls src={outputUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
              <a
                href={outputUrl}
                download="output.mp3"
                className="text-blue-500 hover:text-blue-700 transition mt-2 inline-block"
              >
                Download MP3
              </a>
            </div>
          )}
        </div>
      )}
      <p ref={messageRef} className="text-sm text-gray-500 mt-4"></p>
    </div>
  );
};

export default AudioConverter;
