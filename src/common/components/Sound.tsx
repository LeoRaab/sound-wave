import { useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useTouch from '../hooks/use-touch';
import soundFile from '../../assets/sounds/sound.mp3';

const Sound = () => {
  const { camera } = useThree();
  const { isTouched } = useTouch();
  const buffer = useLoader(THREE.AudioLoader, soundFile);
  const listener = useRef<THREE.AudioListener>(new THREE.AudioListener());
  camera.add(listener.current);
  const sound = useRef<THREE.Audio>(new THREE.Audio(listener.current));

  useFrame(({ pointer }) => {
    if (buffer && isTouched && !sound.current.isPlaying) {
      sound.current.setBuffer(buffer);
      sound.current.setLoop(true);
      sound.current.play();
    }

    if (sound.current.isPlaying && isTouched) {
      console.log(pointer);
    }

    if (sound.current.isPlaying && !isTouched) {
      sound.current.pause();
    }
  });
  
  return <></>;
};

export default Sound;
