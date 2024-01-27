import React, { useState, useRef, useEffect } from 'react';
import './design.css';

const TextToSpeechWithMic = () => {
  const [recording, setRecording] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null); // Reference to the media recorder
  const API_TOKEN = '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'; // Replace with your actual API token
  const apiUrl = 'https://api-inference.huggingface.co/models/m3hrdadfi/wav2vec2-large-xlsr-georgian'; // Replace with your API endpoint

  useEffect(() => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = document.getElementById('audio-player');
      audioElement.src = audioUrl;
    }
  }, [audioBlob]);

  const handleStartRecording = async () => {
    setRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; // Store the media recorder in the ref

      const audioChunks = [];
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        await sendAudioToApi(audioBlob);
        setRecording(false); // Set recording to false after sending audio to API
      });

      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing the microphone:', error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSaveRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'voice_recording.wav'; // You can set the desired file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error('No audio blob to save.');
    }
  };

  const sendAudioToApi = async (audioBlob) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: audioBlob,
      });

      const result = await response.json();

      if (result && result.text) {
        setApiResponse(result.text); // Set the recognized text to state
      } else {
        console.error('Invalid API response:', result);
      }
    } catch (error) {
      console.error('Error sending audio to API:', error);
    }
  };

  return (
    <div className="voice_to_text">
      <h1>Voice to Text Converter</h1>
      <div>
        <button onClick={handleStartRecording} disabled={recording}>
          {recording ? 'Recording...' : 'Start Recording'}
        </button>
        <button onClick={handleStopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button onClick={handleSaveRecording} disabled={!audioBlob}>
          Save Recording
        </button>
        <div id="convert_text">
          {apiResponse && (
            <div>
              <p>Recognized Text:</p>
              <div>{apiResponse}</div>
            </div>
          )}
        </div>
        {audioBlob && (
          <audio id="audio-player" controls>
            <source src="" type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>
    </div>
  );
};

export default TextToSpeechWithMic;



// import React, { useState, useRef } from 'react';
// import './design.css';

// const TextToSpeechWithMic = () => {
//   const [recording, setRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const mediaRecorderRef = useRef(null); // Reference to the media recorder
//   const API_TOKEN = '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'; // Replace with your actual API token
//   const apiUrl = 'https://api-inference.huggingface.co/models/m3hrdadfi/wav2vec2-large-xlsr-georgian'; // Replace with your API endpoint

//   const handleStartRecording = async () => {
//     setRecording(true);

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder; // Store the media recorder in the ref

//       const audioChunks = [];
//       mediaRecorder.addEventListener('dataavailable', (event) => {
//         audioChunks.push(event.data);
//       });

//       mediaRecorder.addEventListener('stop', async () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         setAudioBlob(audioBlob);
//         setRecording(false); // Set recording to false after sending audio to API
//       });

//       mediaRecorder.start();
//     } catch (error) {
//       console.error('Error accessing the microphone:', error);
//     }
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleSaveRecording = () => {
//     if (audioBlob) {
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const a = document.createElement('a');
//       a.href = audioUrl;
//       a.download = 'voice_recording.wav'; // You can set the desired file name
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     } else {
//       console.error('No audio blob to save.');
//     }
//   };

//   const sendAudioToApi = async (audioBlob) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${API_TOKEN}`,
//         },
//         body: audioBlob,
//       });

//       const result = await response.json();

//       if (result && result.audio) {
//         setAudioBlob(result.audio); // Set the audio blob to state
//       } else {
//         console.error('Invalid API response:', result);
//       }
//     } catch (error) {
//       console.error('Error sending audio to API:', error);
//     }
//   };

//   return (
//     <div className="voice_to_text">
//       <h1>Voice to Text Converter</h1>
//       <div>
//         <button onClick={handleStartRecording} disabled={recording}>
//           {recording ? 'Recording...' : 'Start Recording'}
//         </button>
//         <button onClick={handleStopRecording} disabled={!recording}>
//           Stop Recording
//         </button>
//         <button onClick={handleSaveRecording} disabled={!audioBlob}>
//           Save Recording
//         </button>
//         <div id="convert_text">
//           {audioBlob && (
//             <audio controls>
//               <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
//               Your browser does not support the audio tag.
//             </audio>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextToSpeechWithMic;




// import React, { useState, useRef } from 'react';
// import './design.css';

// const TextToSpeechWithMic = () => {
//   const [recording, setRecording] = useState(false);
//   const [apiResponse, setApiResponse] = useState('');
//   const [audioBlob, setAudioBlob] = useState(null);
//   const mediaRecorderRef = useRef(null); // Reference to the media recorder
//   const API_TOKEN = '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'; // Replace with your actual API token
//   const apiUrl = 'https://api-inference.huggingface.co/models/m3hrdadfi/wav2vec2-large-xlsr-georgian'; // Replace with your API endpoint

//   const handleStartRecording = async () => {
//     setRecording(true);

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder; // Store the media recorder in the ref

//       const audioChunks = [];
//       mediaRecorder.addEventListener('dataavailable', (event) => {
//         audioChunks.push(event.data);
//       });

//       mediaRecorder.addEventListener('stop', async () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         setAudioBlob(audioBlob);
//         await sendAudioToApi(audioBlob);
//         setRecording(false); // Set recording to false after sending audio to API
//       });

//       mediaRecorder.start();
//     } catch (error) {
//       console.error('Error accessing the microphone:', error);
//     }
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleSaveRecording = () => {
//     if (audioBlob) {
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const a = document.createElement('a');
//       a.href = audioUrl;
//       a.download = 'voice_recording.wav'; // You can set the desired file name
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     } else {
//       console.error('No audio blob to save.');
//     }
//   };

//   const sendAudioToApi = async (audioBlob) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${API_TOKEN}`,
//         },
//         body: audioBlob,
//       });

//       const result = await response.json();

//       if (result && result.text) {
//         setApiResponse(result.text); // Set the recognized text to state
//       } else {
//         console.error('Invalid API response:', result);
//       }
//     } catch (error) {
//       console.error('Error sending audio to API:', error);
//     }
//   };

//   return (
//     <div className="voice_to_text">
//       <h1>Voice to Text Converter</h1>
//       <div>
//         <button onClick={handleStartRecording} disabled={recording}>
//           {recording ? 'Recording...' : 'Start Recording'}
//         </button>
//         <button onClick={handleStopRecording} disabled={!recording}>
//           Stop Recording
//         </button>
//         <button onClick={handleSaveRecording} disabled={!audioBlob}>
//           Save Recording
//         </button>
//         <div id="convert_text">
//           {apiResponse && (
//             <div>
//               <p>Recognized Text:</p>
//               <div>{apiResponse}</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextToSpeechWithMic;