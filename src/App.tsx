/**
 * TODO: use Context + Reducer for state handling
 */

import { Canvas } from '@react-three/fiber';
import Wave from './common/components/Wave';
import Sound from './common/components/Sound';
import { useState } from 'react';
import { useSpring } from '@react-spring/three';
import UIOverlay from './common/components/UIOverlay';

const App = () => {
  const [isPlayOn, setIsPlayOn] = useState<boolean>(false);
  const [isDetuneOn, setIsDetuneOn] = useState<boolean>(false);
  const [isLowPassOn, setIsLowPassOn] = useState<boolean>(false);

  const [ticks, setTicks] = useState(0);
  const { ticksSpring, clickSpring } = useSpring({
    ticksSpring: ticks, // Springy tick value (each click / release is a tick)
    clickSpring: ticks % 2 === 1 ? 1 : 0, // Springy click factor (1 means clicked, 0 means released)
    config: { tension: 20, friction: 20, clamp: true },
  });
  const bind = {
    onPointerDown: (e: any) => {
      // Capture the pointer so it's still tracked outside the window
      e.target.setPointerCapture(e.pointerId);
      setTicks(ticks + 1);
    },
    onPointerUp: () => {
      // Prevent misfires
      if (ticks % 2 === 1) {
        // Only finish the animation if held down for long enough
        if (clickSpring.get() > 0.5) setTicks(ticks + 1);
        // Otherwise undo the contraction (this way you can't speed up the animation by spam clicking)
        else setTicks(ticks - 1);
      }
    },
  };

  return (
    <>
      <Canvas orthographic camera={{ zoom: 20 }} resize={{ polyfill: ResizeObserver }} {...bind}>
        <color attach="background" args={['black']} />
        <Wave ticksSpring={ticksSpring} clickSpring={clickSpring} />
        <Sound isPlayOn={isPlayOn} isDetuneOn={isDetuneOn} isLowPassOn={isLowPassOn} />
      </Canvas>
      <UIOverlay
        isPlayOn={isPlayOn}
        onPlayClick={() => setIsPlayOn(!isPlayOn)}
        onDetuneClick={() => setIsDetuneOn(!isDetuneOn)}
        onLowPassClick={() => setIsLowPassOn(!isLowPassOn)}
      />
    </>
  );
};

export default App;
