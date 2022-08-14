import { Canvas } from '@react-three/fiber';
import Wave from './common/components/Wave';
import Sound from './common/components/Sound';

const App = () => {

  return (
    <Canvas orthographic camera={{ zoom: 20 }}>
      <color attach="background" args={['black']} />
      <Wave />
      <Sound />
    </Canvas>
  );
};

export default App;
