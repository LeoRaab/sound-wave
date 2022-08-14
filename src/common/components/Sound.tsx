import { useEffect, useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useTouch from '../hooks/use-touch';
import soundFile from '../../assets/sounds/sound.mp3';

const Sound = () => {
  const { camera } = useThree();
  const { isTouched } = useTouch();

  const buffer = useLoader(THREE.AudioLoader, soundFile);
  const listener = useRef<THREE.AudioListener>(new THREE.AudioListener());
  const audio = useRef<THREE.Audio>(new THREE.Audio(listener.current));

  camera.add(listener.current);

  const lowPassFilter = new BiquadFilterNode(audio.current.context, { type: 'lowpass', frequency: 10000 });
  audio.current.setFilter(lowPassFilter);

  useFrame(({ pointer }) => {
    if (buffer && isTouched && !audio.current.isPlaying) {
      audio.current.setBuffer(buffer);
      audio.current.setLoop(true);
      audio.current.play();
    }

    if (audio.current.isPlaying && isTouched) {
      if (pointer.x > 0.1) {
        lowPassFilter.frequency.value = 532;
      } else {
        lowPassFilter.frequency.value = 10000;
      }
    }

    if (audio.current.isPlaying && !isTouched) {
      audio.current.pause();
    }
  });

  return <></>;
};

export default Sound;
