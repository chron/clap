import { useEffect } from 'react';

function handleSuccess(stream, callback) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  const processor = context.createScriptProcessor(1024, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  source.connect(analyser);
  analyser.connect(processor);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    const average = array.reduce((s,c) => s + c) / array.length;

    callback(average);
  };
}

export default function useMicrophoneVolume(callback) {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(s => {
      handleSuccess(s, callback);
    });

    // TODO: cleanup function?
  }, []);
}
