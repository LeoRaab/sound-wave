import { useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useTouch from '../hooks/use-touch';
import soundFile from '../../assets/sounds/the-podcast.mp3';
import calcLowPassFreq from '../util/calc-low-pass-freq';

type SoundProps = {
  isPlayOn: boolean;
  isDetuneOn: boolean;
  isLowPassOn: boolean;
}

const Sound = ({isPlayOn, isDetuneOn, isLowPassOn}: SoundProps) => {
  const { camera } = useThree();
  const { isTouched } = useTouch();

  const buffer = useLoader(THREE.AudioLoader, soundFile);
  const listener = useRef<THREE.AudioListener>(new THREE.AudioListener());
  const audio = useRef<THREE.Audio>(new THREE.Audio(listener.current));

  camera.add(listener.current);

  const lowPassFilter = new BiquadFilterNode(audio.current.context, { type: 'lowpass', frequency: 10000 });
  audio.current.setFilter(lowPassFilter);

  useFrame(({ pointer }) => {
    if (buffer && isPlayOn && !audio.current.isPlaying) {
      audio.current.setBuffer(buffer);
      audio.current.setLoop(true);
      audio.current.play();
    }

    if (audio.current.isPlaying && isTouched && isDetuneOn) {
      audio.current.setDetune(-1000);
    }

    if (audio.current.isPlaying && isTouched && isLowPassOn) {
      const { x, y } = pointer;
      const lowPassFreq = calcLowPassFreq(x, y);
      lowPassFilter.frequency.value = lowPassFreq;      
    }    

    if (audio.current.isPlaying && !isTouched) {
      audio.current.setDetune(0);
    }

    if (audio.current.isPlaying && !isPlayOn) {
       audio.current.pause();
    }
  });

  return <></>;
};

export default Sound;
